"use strict";
const path = require("path");
const assert = require("yeoman-assert");
const helpers = require("yeoman-test");
const fs = require("fs-extra");

describe("generator-semantic-release:app", () => {
  it("creates .releaserc", () => {
    return helpers.run(path.join(__dirname, "../generators/app")).then(() => {
      assert.file([".releaserc"]);
      assert.jsonFileContent(".releaserc", {
        plugins: [
          "@semantic-release/commit-analyzer",
          "@semantic-release/release-notes-generator",
          "@semantic-release/changelog",
          "@semantic-release/git"
        ]
      });
    });
  });

  it("updates existing .releaserc", () => {
    return helpers
      .run(path.join(__dirname, "../generators/app"))
      .inTmpDir(dir => {
        var done = this.async;
        fs.writeJson(
          path.join(dir, ".releaserc"),
          { branches: ["master"] },
          {},
          done
        );
      })
      .then(dir => {
        assert.file(path.join(dir, ".releaserc"));
        assert.jsonFileContent(".releaserc", {
          branches: ["master"],
          plugins: [
            "@semantic-release/commit-analyzer",
            "@semantic-release/release-notes-generator",
            "@semantic-release/changelog",
            "@semantic-release/git"
          ]
        });
      });
  });
});
