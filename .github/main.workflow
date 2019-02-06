workflow "publish on release" {
  on = "release"
  resolves = ["publish"]
}

action "publish" {
  uses = "actions/npm@3c8332795d5443adc712d30fa147db61fd520b5a"
  args = "publish"
  secrets = ["NPM_AUTH_TOKEN"]
}
