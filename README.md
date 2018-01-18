# fightforthefuture.org

[![CircleCI](https://circleci.com/gh/fightforthefuture/fightforthefuture.org/tree/production.svg?style=svg)](https://circleci.com/gh/fightforthefuture/fightforthefuture.github.io/tree/production)

## Campaigners

All your documentation has been moved to [the wiki][00].

## Developers:

<https://www.fightforthefuture.org/> is hosted on Amazon S3 and CloudFlare.

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

#### Production: Amazon S3

fightforthefuture.org is hosted on [Amazon S3][06]. Here’s how it works: every time a commit is pushed to the `production` branch, [Circle CI][01] runs a build and deploys that to an S3 bucket.

##### Local Deploys

1. Ensure that you have the [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/installing.html) installed
2. Create a named profile in `~/.aws/credentials` called `fftf-s3-deploy` with valid credentials.
3. `npm run deploy`

##### Blog

The blog content is pulled from [Tumblr](https://fight4future.tumblr.com) using [`scripts/sync_tumblr.js`](scripts/sync_tumblr.js) and an AWS Lambda function triggers a Circle CI build whenever a new Tumblr post is detected.

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
[01]: https://circleci.com/gh/fightforthefuture/fightforthefuture.github.io/tree/production
[02]: https://lyonbros.github.io/composer.js/
[03]: http://jekyllrb.com/docs/home/
[04]: http://gruntjs.com/getting-started
[05]: https://github.com/503.html
[06]: https://aws.amazon.com/s3/
[07]: https://devcenter.heroku.com/articles/github-integration-review-apps
[08]: https://pages.18f.gov/frontend/
