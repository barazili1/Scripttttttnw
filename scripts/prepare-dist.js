import fs from "node:fs";
import path from "node:path";

const distDir = path.resolve("dist");
const clientDir = path.join(distDir, "client");

// Ensure dist exists
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Copy client assets to dist root if clientDir exists
if (fs.existsSync(clientDir)) {
  for (const file of fs.readdirSync(clientDir)) {
    const src = path.join(clientDir, file);
    const dest = path.join(distDir, file);
    if (fs.statSync(src).isDirectory()) {
      fs.cpSync(src, dest, { recursive: true });
    } else {
      fs.copyFileSync(src, dest);
    }
  }
}

// Find CSS and JS in dist/assets
let cssFile = "";
let jsFile = "";
const assetsDir = path.join(distDir, "assets");
if (fs.existsSync(assetsDir)) {
  for (const file of fs.readdirSync(assetsDir)) {
    if (file.endsWith(".css")) cssFile = file;
    if (file.startsWith("index-") && file.endsWith(".js")) jsFile = file;
  }
}

const htmlContent = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>SMART AI</title>
  <meta name="description" content="منصة SMART AI لتحليلات وإشارات الألعاب المباشرة مع توقعات ذكية لمنصة BIZBET بدقة عالية." />
  <meta name="author" content="SMART AI" />
  <meta property="og:title" content="SMART AI" />
  <meta property="og:description" content="منصة SMART AI لتحليلات وإشارات الألعاب المباشرة مع توقعات ذكية لمنصة BIZBET بدقة عالية." />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="https://cdn.phototourl.com/member/2026-09-29-c81bf031-27ef-4421-8822-b37c2fb087d4.jpg" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:image" content="https://cdn.phototourl.com/member/2026-09-29-c81bf031-27ef-4421-8822-b37c2fb087d4.jpg" />
  <meta name="twitter:site" content="@Lovable" />
  <link rel="icon" href="https://cdn.phototourl.com/member/2026-09-29-c81bf031-27ef-4421-8822-b37c2fb087d4.jpg" type="image/jpeg" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&family=Chakra+Petch:wght@300;400;500;600;700&family=Goldman:wght@400;700&family=Share+Tech+Mono&family=Michroma&display=swap" />
  ${cssFile ? `<link rel="stylesheet" href="/assets/${cssFile}" />` : ""}
</head>
<body class="bg-black text-white">
  <div id="root"><div class="min-h-screen bg-black"></div></div>
  <script class="$tsr" id="$tsr-stream-barrier">(self.$R=self.$R||{})["tsr"]=[];self.$_TSR={h(){this.hydrated=!0,this.c()},e(){this.streamEnded=!0,this.c()},c(){this.hydrated&&this.streamEnded&&(delete self.$_TSR,delete self.$R.tsr)},p(e){this.initialized?e():this.buffer.push(e)},buffer:[]};$_TSR.router=($R=>$R[0]={manifest:$R[1]={routes:$R[2]={__root__:$R[3]={preloads:$R[4]=["/assets/${jsFile}"],scripts:$R[5]=[$R[6]={attrs:$R[7]={type:"module",async:!0,src:"/assets/${jsFile}"}}],css:$R[8]=[$R[9]={href:"/assets/${cssFile}"}]}}},matches:$R[10]=[$R[11]={i:"__root__ ",u:1791911772973,s:"success",ssr:!0},$R[12]={i:"  ",u:1791911772986,s:"success",ssr:!0}],lastMatchId:"  "})($R["tsr"]);$_TSR.e();document.currentScript?.remove();</script>
  ${jsFile ? `<script type="module" async src="/assets/${jsFile}"></script>` : ""}
</body>
</html>
`;

fs.writeFileSync(path.join(distDir, "index.html"), htmlContent);
console.log(
  "✅ dist/ successfully populated with index.html, assets, and full deployment artifacts.",
);
