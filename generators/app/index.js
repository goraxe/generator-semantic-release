"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");

const releasrc = {
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
    "@semantic-release/git"
  ]
};

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to the groovy ${chalk.red(
          "generator-semantic-release"
        )} generator!`
      )
    );

    const prompts = [];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  writing() {
    if (this.fs.exists(".releaserc")) {
      this.fs.extendJSON(".releaserc", releasrc);
    } else {
      this.fs.writeJSON(".releaserc", releasrc);
    }
  }

  install() {
    this.installDependencies();
  }
};
