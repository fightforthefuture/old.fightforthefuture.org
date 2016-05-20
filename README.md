# fightforthefuture.org

## Campaigners

All your documentation has been moved to [the wiki][00].

## Developers:

<https://www.fightforthefuture.org/> is hosted by github pages. There is a clone on Heroku with no _automated_ failover (at this time.) Review apps can be spun off on Heroku with a single click in the app pipeline on the Heroku dashboard.

### Housekeeping

#### Dependencies:

- See `.ruby-version` for expected Ruby
- Node and npm versions are declared in `package.json`

Here’s a thing—this is not a willy-nilly slapdash combination of underscores, dashes, and camelCase. There is a method to its madness. Underscores are used in Ruby variables. All over the place in `yml` and Liquid. Dashes are used in Less/CSS. Because that is how it is done. And camelCase is BFFs with Javascript. They are meant for each other.

#### Frameworks and libraries

- [Jekyll][03]
- [Grunt.js][04]

### Installing & running the server

- `npm install`. First this makes sure `bundle` is installed, then it installs npm packages & ruby gems.
- `npm start` to run grunt (compiles assets, then watches for changes and compiles those too.)

### Deploying

#### Production: GitHub Pages

fightforthefuture.org is hosted on [GitHub Pages][06]. Here’s how it works: every time a commit is pushed, [Travis CI][01] runs a build. Every time a pull request is merged on the the `production` branch, the result of that build is committed and pushed to the github pages branch. (For org-level sites, such as this one, the github pages branch is `master`, _not_ `gh-pages`)

#### Heroku

Because having a backup plan is always a good idea, and the [Heroku][05] pipeline feature is *awesome*, we deploy there too. We get two great things out of this. First, every time a commit is merged into `production`—assuming the build isn’t broken—<http://fftf-org.herokuapp.com/> is deployed, leaving us a backup plan for the next time GitHub does the [angry unicorn][05] dance.

The other fun part about having the site connected to a Heroku pipeline is that it gives us the chance to play with [review apps][07]. They're a one-click deploy from the app’s pipeline dashboard. If you want your review app to connect to (our internal middleman for) the Action Network API, make sure to set its `URL` and `PETITIONS_API` env variables. (note: you generally won’t need these for local or production deployment)

### Code Structure

#### CSS/Less

- All Less files compiled and minified to `public/css/core.css`
- When in doubt, make a new Less file and import it in `core.less`—there’s no real performance hit as a result of good organization
- Don’t worry about browser prefixes. Grunt handles that too.
- Follow the [18F Front end style guide][08]

#### Javascript

##### This is all aspirational, a boilerplate being applied to a legacy codebase

- `js/main.js` will generally be used to contain the main page logic.
- `js/controllers` will contain all Composer controllers
- `js/models` is there for Composer models and collections
- `js/views` not just for Composer views, but for individual page logic on pages that have absolutely zero relationship with Composer. Also, regarding Composer views: use raw markup where you can, for speed.
- This all compiles down to `public/js/core.js` via grunt, which also uglifies it - If you’re adding a javascript file that ought to be included in `core.js`, make sure to add its path to the files array inside the `concat` task in `Gruntfile.js`

[00]: https://github.com/fightforthefuture/fightforthefuture.github.io/wiki
[01]: https://travis-ci.org/fightforthefuture/fightforthefuture.github.io/
[02]: https://lyonbros.github.io/composer.js/
[03]: http://jekyllrb.com/docs/home/
[04]: http://gruntjs.com/getting-started
[05]: https://github.com/503.html
[06]: https://help.github.com/articles/user-organization-and-project-pages/#user--organization-pages
[07]: https://devcenter.heroku.com/articles/github-integration-review-apps
[08]: https://pages.18f.gov/frontend/
