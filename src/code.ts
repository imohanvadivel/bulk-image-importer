let columnsCount = 10;
let xGap = 0.2;
let yGap = 0.2;
let figmaNodes: RectangleNode[] = [];

function settleAll(promises) {
    const settledPromises = promises.map((promise) =>
        promise.then((value) => ({ status: "fulfilled", value })).catch((value) => ({ status: "rejected", value }))
    );
    return Promise.all(settledPromises);
}

figma.ui.onmessage = async (msg) => {
    figmaNodes.length = 0;

    let promises: any = [];
    msg.forEach((e: string) => promises.push(getImageData(e)));

    let dataAry = await settleAll(promises);

    dataAry = dataAry.filter((e) => e.status === "fulfilled");
    dataAry = dataAry.map((e) => e.value);

    let totalImageCount = dataAry.length;
    let imageIndex = 0;

    const bounds = figma.viewport.bounds;

    let x = Math.round(bounds.x + bounds.width / 3);
    let y = Math.round(bounds.y + bounds.height / 3);

    while (dataAry.length > 0) {
        const imgAry = dataAry.splice(0, columnsCount);

        let prevDimension = [];

        for (let m = 0; m < imgAry.length; m++) {
            let url = msg[imageIndex++];

            const { width, height } = await imgAry[m].getSizeAsync();

            if (m === 0) {
                prevDimension.push({ x, y, width, height });
                appendImage(imgAry[m], x, y, width, height, url);
                continue;
            }

            let prev = prevDimension[prevDimension.length - 1];
            x = prev.x + prev.width + Math.round(prev.width * xGap);
            y = prev.y;
            prevDimension.push({ x, y, width, height });

            appendImage(imgAry[m], x, y, width, height, url);
        }

        x = prevDimension[0].x;
        let maxHeight = prevDimension.reduce((a, e) => Math.max(a, e.height), -Infinity);
        y = y + maxHeight + Math.round(maxHeight * yGap);
    }

    figma.closePlugin(`Total of ${totalImageCount} images has been imported`);
};

async function getImageData(url: string) {
    return await figma.createImageAsync(url);
}

function appendImage(image: Image, x: number, y: number, width: number, height: number, url: string) {
    const node = figma.createRectangle();
    figmaNodes.push(node);
    node.resize(width, height);
    node.x = x;
    node.y = y;
    node.name = url;

    node.fills = [
        {
            type: "IMAGE",
            imageHash: image.hash,
            scaleMode: "FILL",
        },
    ];
}

figma.showUI(__html__, { themeColors: true, height: 320, width: 320 });
