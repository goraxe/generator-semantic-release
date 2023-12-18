"use strict";
import Generator from "yeoman-generator";
import chalk from "chalk";
import yosay from "yosay";

const releasrc = {
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
    "@semantic-release/git"
  ]
};

const badge =
  "[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)";

export default class extends Generator {
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
    if (this.fs.exists(this.destinationPath(".releaserc"))) {
      this.fs.extendJSON(this.destinationPath(".releaserc"), releasrc);
    } else {
      this.fs.writeJSON(this.destinationPath(".releaserc"), releasrc);
    }

    if (this.fs.exists(this.destinationPath("README.md"))) {
      let readme = this.fs.read(this.destinationPath("README.md"));
      if (!readme.includes(badge)) {
        readme = badge + "\n" + readme;
      }

      this.fs.write(this.destinationPath("README.md"), readme);
    }
  }

  end() {
    this.config.save();
  }
}
