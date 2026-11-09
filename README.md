# 楠理子的个人小站

用 GitHub Pages 发布的静态站点。没有构建步骤，改完 HTML，推送到 GitHub 就会更新。

栏目：

- 首页 `index.html`
- 关于 `about.html`
- 书页 `writing/`
- 写真 `photos/`

现在放着的短篇《退潮》是示例，用来看版式。发布前换成你自己的内容，或者整篇删掉。页面顶部的虚线纸条是占位提示，写完删掉那段 `<p class="draft-note">`。

站点固定为深色模式，没有亮色切换。

## 本地预览

直接双击 `index.html` 即可。

也可以在这个目录开一个本地服务器：

```bash
python -m http.server 8080
```

然后打开 <http://127.0.0.1:8080> 。

## 改内容

名字出现在每一页的页眉、页脚和标题里。要换笔名，在项目里搜索「楠理子」一起替换。站名旁的小头像是 `images/icon.png`；首页和关于页的篆书「楠」印是 `images/seal-nan.png`；`favicon.svg` 里还有一个「理」字，换名时也一起改。

颜色在 `css/style.css` 最上面的 `:root`。大标题用 `--serif`，正文用 `--sans`，改这两个变量就能换字体。

首页左侧的题记在 `index.html` 的 `.hero-quote`，换成你自己的句子；下面「楠 理子」的落款、注音和印章也在同一段。阅读页顶部的进度条由 `js/site.js` 控制，不需要可以删掉 HTML 里的 `.reading-progress`。

### 新增一篇小说

1. 复制整个 `writing/tide/` 文件夹，改成新的目录名。
2. 改 `index.html` 里的简介和章节目录。
3. 正文在 `01.html`。下一章复制为 `02.html`，并在目录页加一行。章节底部的「目录」或「上一章 / 下一章」链接要手改。
4. 在 `writing/index.html` 登记这篇作品。想出现在首页「最近」，再去根目录的 `index.html` 加一条。

正文每一段用一个 `<p>`。中文段首缩进由样式负责，不用自己打空格。

### 新增一张写真

1. 把图片放进 `images/photos/`。
2. 打开 `photos/index.html`，按页顶纸条里的那一格，填上文件名和说明。
3. 放进照片后，删掉「还没有照片」那一句。

### 图片与字体

- `images/portrait.jpg`：首页右侧的立绘。
- `images/icon.png`：页眉的小头像和浏览器图标。
- `images/seal-nan.png`：篆书「楠」印的透明 PNG，首页与关于页共用。想换字，重新渲染一张同名图片即可。

正文字体是霞鹜文楷，通过 jsDelivr 引入；标题使用系统宋体，不额外加载字体文件。

## 字体与素材授权

- 霞鹜文楷（LXGW WenKai）以 SIL Open Font License 1.1 发布，站点通过 CDN 引用，未随仓库分发字体文件。
- 篆书「楠」字取自中央研究院[小學堂](https://xiaoxue.iis.sinica.edu.tw/)发布的崇羲篆體（作者王心怡、季旭昇），字体以 [CC BY-ND 3.0 臺灣及其後版本](https://creativecommons.org/licenses/by-nd/3.0/tw/)发布。`images/seal-nan.png` 是用该字体渲染出的单字图片，仓库不包含字体文件。

## 发布到 GitHub Pages

仓库需要是公开的（私有仓库的 Pages 要付费方案）。

1. 在 GitHub 新建一个空仓库，不要勾选 README、.gitignore（本地已经有了）。
2. 在这个目录执行（把地址换成你的仓库）：

```bash
git remote add origin https://github.com/你的用户名/仓库名.git
git push -u origin main
```

3. 打开仓库的 Settings → Pages。
4. Build and deployment 选 Deploy from a branch。
5. Branch 选 `main`，文件夹选 `/ (root)`，保存。
6. 等一两分钟。项目站的地址一般是：

```text
https://你的用户名.github.io/仓库名/
```

如果仓库名就是 `你的用户名.github.io`，地址是 `https://你的用户名.github.io/`，没有后面的仓库名。

本站链接全部是相对路径，两种地址都能用。不要改成 `/css/style.css` 这种从网站根开始的写法，否则项目站（带仓库名的那种）会找不到样式。

自定义域名：在仓库 Pages 设置里填写域名，按 GitHub 的提示去域名服务商加记录。不要自己先丢一个空的 `CNAME` 文件。

## 小提示

- 根目录的 `.nojekyll` 是故意放的，用来告诉 GitHub「不要用 Jekyll 处理这个站」。删掉它，有些文件名可能被吃掉。
- `404.html` 只在 GitHub Pages 上、访问不存在的地址时出现。深层错误地址的样式偶尔会找不到，这是 Pages 的老问题，不影响正常页面。
