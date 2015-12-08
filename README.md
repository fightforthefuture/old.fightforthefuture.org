# Fight for the Future: the website

## Campaign and Content folks!

- Generally, content is written in Markdown format. You can find documentation
for this wonderful plain text formatting syntax all over:
    - [daringfireball][07], the source of markdown
    - [github][08]'s docs are super easy to follow
    - [Discount][09] documents some extra features we have available to us
- Any content that is blog-post-like in nature can be found in `site/_posts`.
- Any new page should be created in `site/posts` following the naming convention
`YYYY-MM-DD-post-title.md`—its URL will be fightforthefuture.org/post-title/
- If you are unclear on updating the html, ask a dev and we’re happy to help!

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

### Sample jekyll/liquid code

Cycle through markdown files in `_posts` directory

```liquid
{% for post in site.posts %}

# [{{ post.title }}](#{{ post.slug }})

<time datetime="{{ post.date | date_to_rfc822 }}"></time>

{{ post.content }}

{% endfor %}
```

[01]: https://github.com/sstephenson/rbenv
[02]: https://lyonbros.github.io/composer.js/
[03]: http://jekyllrb.com/docs/home/
[04]: http://gruntjs.com/getting-started
[05]: https://github.com/Shopify/liquid/wiki/Liquid-for-Designers

[07]: http://daringfireball.net/projects/markdown/syntax
[08]: https://help.github.com/articles/markdown-basics/
[09]: http://www.pell.portland.or.us/~orc/Code/discount/#Language.extensions
