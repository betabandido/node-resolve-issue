# Example code to reproduce issue with @rollup/plugin-node-resolve

This example contains two dummy packages that import `@laverdet/lokesh-colorthief`, which in turn imports code from a dependant package (`get-pixels`). Depending on the specific `@rollup/plugin-node-resolve` version used, the generated bundle contains code either from the `main` entry in package.json or the `module` entry for the `get-pixels` dependency.

This creates issues when `@laverdet/lokesh-colorthief` is being used in a bundle that it is supposed to be run in a browser.

Build instructions:

```shell
pnpm install
pnpm lerna run build
```

This will build both packages (one using `@rollup/plugin-node-resolve` version 13 and the other one version 15). By looking at the contents of the `dist` folder (e.g., files `dist/esm/index.js`) it is possible to see how the bundle generated with version 13 uses the code from the `module` entry:

```javascript
var e=function(t){this.canvas=document.createElement("canvas"),this.context=this.canvas.getContext("2d"),this.width=this.canvas.width=t.naturalWidth,this.height=this.canvas.height=t.naturalHeight,this.context.drawImage(t,0,0,this.width,this.height);};e.prototype.getImageData=function(){return this.context.getImageData(0,0,this.width,this.height)};var n=function(){};n.prototype.getColor=function(t,e){return void 0===e&&(e=10),this.getPalette(t,5,e)[0]},n.prototype.getPalette=function(n,o,a){var r=function(t){var e=t.colorCount,n=t.quality;if(void 0!==e&&Number.isInteger(e)){if(1===e)throw new Error("colorCount should be between 2 and 20. To get one color, call getColor() instead of getPalette()");e=Math.max(e,2),e=Math.min(e,20);}else e=10;return (void 0===n||!Number.isInteger(n)||n<1)&&(n=10),{colorCount:e,quality:n}}({colorCount:o,quality:a}),i=new e(n),s=function(t,e,n){for(var o,a,r,i,s,h=t,u=[],l=0;l<e;l+=n)a=h[0+(o=4*l)],r=h[o+1],i=h[o+2],(void 0===(s=h[o+3])||s>=125)&&(a>250&&r>250&&i>250||u.push([a,r,i]));return u}(i.getImageData().data,i.width*i.height,r.quality),h=quantize(s,r.colorCount);return h?h.palette():null},n.prototype.getColorFromUrl=function(t,e,n){var o=this,a=document.createElement("img");a.addEventListener("load",function(){var r=o.getPalette(a,5,n);e(r[0],t);}),a.src=t;},n.prototype.getImageData=function(t,e){var n=new XMLHttpRequest;n.open("GET",t,!0),n.responseType="arraybuffer",n.onload=function(){if(200==this.status){var t=new Uint8Array(this.response);i=t.length;for(var n=new Array(i),o=0;o<t.length;o++)n[o]=String.fromCharCode(t[o]);var a=n.join(""),r=window.btoa(a);e("data:image/png;base64,"+r);}},n.send();},n.prototype.getColorAsync=function(t,e,n){var o=this;this.getImageData(t,function(t){var a=document.createElement("img");a.addEventListener("load",function(){var t=o.getPalette(a,5,n);e(t[0],this);}),a.src=t;});};

// @ts-ignore
console.log(new n().getPalette({}));
```

while the one generated with version 15 uses the code from the `main` entry:

```javascript
function getPalette(img, colorCount = 10, quality = 10) {
    const options = validateOptions({
        colorCount,
        quality
    });

    return new Promise((resolve, reject) => {
        loadImg(img)
            .then(imgData => {
                const pixelCount = imgData.shape[0] * imgData.shape[1];
                const pixelArray = createPixelArray(imgData.data, pixelCount, options.quality);

                const cmap = quantize(pixelArray, options.colorCount);
                const palette = cmap? cmap.palette() : null;

                resolve(palette);
            })
            .catch(err => {
                reject(err);
            });
    });
}

var colorThief = {
    getColor,
    getPalette
};

// @ts-ignore
console.log(new colorThief().getPalette({}));
```