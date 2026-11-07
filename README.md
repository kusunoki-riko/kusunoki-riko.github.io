# 楠理子的个人小站

用 GitHub Pages 发布的静态站点。没有构建步骤，改完 HTML，推送到 GitHub 就会更新。

栏目：

- 首页 `index.html`
- 关于 `about.html`
- 自设 `characters/`
- 书页 `writing/`

现在放着的「未名」和短篇《退潮》是示例，用来看版式。发布前换成你自己的内容，或者整篇删掉。页面顶部的虚线纸条是占位提示，写完删掉那段 `<p class="draft-note">`。

## 本地预览

直接双击 `index.html` 即可。夜读会记住在这台电脑上的选择。

也可以在这个目录开一个本地服务器：

```bash
python -m http.server 8080
```

然后打开 <http://127.0.0.1:8080> 。

## 改内容

名字出现在每一页的页眉、页脚和标题里。要换笔名，在项目里搜索「楠理子」一起替换。首页的大标题和印章里的「理」也要一起看一眼。

颜色在 `css/style.css` 最上面的 `:root`。夜读配色在 `html[data-theme="night"]`。

### 新增一个自设

1. 复制 `characters/weiming.html`，改成新的文件名（建议用拼音或英文，避免链接难写）。
2. 改标题、简介、设定。有图就放进 `images/`，按页面里的注释把字牌换成 `img`。
3. 在 `characters/index.html` 的列表里加一条链接。

### 新增一篇小说

1. 复制整个 `writing/tide/` 文件夹，改成新的目录名。
2. 改 `index.html` 里的简介和章节目录。
3. 正文在 `01.html`。下一章复制为 `02.html`，并在目录页加一行。章节之间的「上一章 / 下一章」要手改链接。
4. 在 `writing/index.html` 登记这篇作品。想出现在首页「最近」，再去根目录的 `index.html` 加一条。

正文每一段用一个 `<p>`。中文段首缩进由样式负责，不用自己打空格。

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
