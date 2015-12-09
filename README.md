# Fight for the Future: the website

Content is, as a general rule, meant to be able to be written in [markdown][a1].
In the long run, there will be several layouts available in `site/_layouts`
which can be thought of as campaign templates. This README will grow with
documentation written on a per-template basis. The templating language we use
here is called [liquid][a2], which gives you lots of power without requiring
knowing a coding language in the traditional sense. There are also some [custom
liquid tags][a3] available just for Fight for the Future. They were written to
go along with the templates that Vasjen designed.

_the following directions will apply for about 95% of new pages. new pages with
a parent directory **may** have a slightly different process._

To generate a new CMS page, create a new file in `site/_posts` entitled
`YYYY-MM-DD-post-title.md`. The CMS page URL will be
fightforthefuture.org/post-title/

***

**TODO:**

- [ ] Independent instructions for each layout
- [ ] (…build each layout)

[a1]: http://kramdown.gettalong.org/quickref.html
[a2]: https://github.com/Shopify/liquid/wiki/Liquid-for-Designers
[a3]: #custom-tags

## Front Matter Options

### All posts/pages

| Option      | Type    |  Possible values                | Notes                                                    |
| :---------: | :-----: | :------------------------------ | :------------------------------------------------------- |
| layout      | string  | any filename in `site/_layouts` | _required_ remove `.html` from value                     |
| title       | string  |                                 | If absent, uses title cased file name less date          |
| description | string  |                                 | Important—used by search engines, twitter, facebook      |
| permalink   | string  |                                 | If page URL should be anything other than its file name  |
| date        | string  |                                 | CSS class added to classlist on body element             |
| class       | string  |                                 | CSS class added to classlist on body element             |
| evergreen   | boolean | true or false                   | True if this is a page that will be referenced long-term |
| share       | object  | See [share][21] table below     |                                                          |
| categories  | array   |                                 | Use 'disallowed' to hide from search engines             |
| changefreq  | string  | See [sitemap changefreq][20]    | Use 'never' for archived pages. Don't use 'always'.      |

### Using “default” layout

Boolean options assumed to be false when excluded.

| Option        | Type    | Values        | Note                                                             |
| :-----------: | :-----: | :------------ | :--------------------------------------------------------------- |
| header        | boolean | true or false | Determines presence of 160px fftf logo in addition to donate ask |
| footer-topper | boolean | true or false | Determines presence of additional links above footer             |

### Share object

| Option |  Type   | Notes                                                                     |
| :----: | :-----: | :------------------------------------------------------------------------ |
| title  | string  | Can differ from page title. Shows up for twitter & facebook shares.       |
| image  | string  | Filename of a share image that exists in `site/img/share/`                |
| width  | integer | Width of share image. Should be ≥ 1200                                    |
| height | integer | Height of share image. Should be ≥ 630                                    |
| tweet  | string  | Text for default tweet. Should be ≤ 115 characters (url will be appended) |


#### Example `share` object

```yml
share:
  title: "Enjoying your internet freedom? Say thanks by donating today."
  image: fftf-share.jpg
  width: 1400
  height: 553
  tweet: "I just donated to @fightfortheftr, and you should too. Do your part to keep the internet free & open for all."
```

[20]: http://www.sitemaps.org/protocol.html#xmlTagDefinitions
[21]: #share-object

## Custom Tags

### `{% readmore %}` tag

To be used in situations where some text is hidden with a jump. For example,

![Learn more…](site/img/documentation/readmore.png)

Intended usage:

```liquid
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis a velit nisl. Cras
ex velit, semper a bibendum in, suscipit eget sem. Donec maximus enim ut rutrum
pellentesque. Morbi ut magna quis dui maximus dignissim in vitae tellus. Fusce
id laoreet arcu, eu iaculis dolor. Phasellus augue ex, aliquet vel consectetur
et, lacinia at dui. Duis justo nunc, cursus ut lacus nec, rhoncus varius arcu.
Duis in pharetra velit.

{% readmore Teaser Text %}
In eget diam varius, sodales turpis vitae, egestas nunc. Cras nec lacus mi.
Curabitur in libero ipsum. Curabitur at lorem sed arcu egestas venenatis quis ut
purus. Cras pharetra libero at mi rhoncus ultrices. Donec elementum rutrum risus
sed vulputate. Aliquam rutrum lectus dolor, at varius ante elementum eu.
Praesent tincidunt quam eu orci bibendum sagittis porttitor sed ante.

Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus
mus. Nulla vehicula est quis lectus laoreet, eu egestas libero dignissim. Morbi
lacinia fermentum imperdiet. Duis auctor tortor quis diam egestas, eu tempus
dolor convallis. Nullam erat metus, lobortis a leo ac, convallis tincidunt
ipsum. Sed sed pellentesque quam.
{% endreadmore %}
```

`Teaser Text` might be "Read more…" or "Learn More" (no quotation marks
necessary) or whatever you wish. The text starting with `In eget diam…` above
would be the entirety of the text meant to be hidden after a "read more" link.

### `{% snapshot %}` tag

For use in templates which include a skeumorphic photograph element. For
example,

![snapshot](site/img/documentation/snapshot.png)

Intended usage:

```liquid
{% snapshot img/page/campaign-name/photo.jpg A brief caption describing the photo or graphic %}
```

(Note: this tag is self-closing, does **not** require `{% endsnapshot %}`)

## Developers:

### Frameworks and libraries

- [Composer.js][02] JavaScript MVC
- [Jekyll][03]
- [Grunt.js][04]
- [Liquid templating language][05]

### Installing & running the server

- Install/switch to Ruby 2.2.2 (i recommend using [rbenv][01])
- `gem install bundler` if it’s not already installed
- `npm install` to install packages,
- `npm start` to run grunt (compiles assets, then watches for changes and
compiles those too.)
- A browser window will open pointed to the local server! 🎉

### Deploying

This boilerplate is set up to make travis autodeploys the easiest thing ever.
To set them up, enable builds at
https://travis-ci.org/$USERNAME/$REPO/settings/
(`$USERNAME` will probably be fightforthefuture)

#### Recommended setup:

General settings:

- [X] Build only if .travis.yml is present
- [X] Build pushes
- [ ] Limit concurrent jobs
- [X] Build pull requests

Environment variables:

- GH_REF: `github.com/$USERNAME/$REPO`
- GH_TOKEN: you can generate this at <https://github.com/settings/tokens>

So, assuming `deploy-ghpages.sh` is written correctly (lol front-end developer
writing bash) travis will build pull requests to make sure they don't break, but
only actually deploy when things are merged to master. So only commit on master
when you’re SURE you’re ready to deploy production.

### Code Structure

#### CSS/Less

```
app/_less
├── base
│   ├── common.less
│   └── variables.less
├── components
│   ├── animation.less
│   └── typography.less
├── core.less
├── lib
│   └── reset.less
└── partials
    └── footer.less
```

- All Less files compiled and minified to `public/css/core.css`
- When in doubt, make a new Less file and import it in `core.less`—there’s no
real performance hit as a result of good organization
- Don’t worry about browser prefixes. Grunt handles that too.

#### Javascript

##### This is all aspirational, a boilerplate being applied to a legacy codebase

- `js/main.js` will generally be used to contain the main page logic.
- `js/controllers` will contain all Composer controllers
- `js/models` is there for Composer models and collections
- `js/views` for Compser views. Use raw markup where you can, for speed.
- This all compiles down to `dist/js/core.js` via grunt, which also uglifies it
- If you’re adding a javascript file that ought to be included in `core.js`,
make sure to add its path to the files array around L167 of `Gruntfile.js`

[01]: https://github.com/sstephenson/rbenv
[02]: https://lyonbros.github.io/composer.js/
[03]: http://jekyllrb.com/docs/home/
[04]: http://gruntjs.com/getting-started
[05]: https://github.com/Shopify/liquid/wiki/Liquid-for-Designers

[07]: http://daringfireball.net/projects/markdown/syntax
[08]: https://help.github.com/articles/markdown-basics/
[09]: http://www.pell.portland.or.us/~orc/Code/discount/#Language.extensions
