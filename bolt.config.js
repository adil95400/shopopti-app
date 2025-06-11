// bolt.config.js
module.exports = {
  autoCommit: true,
  autoPush: true,
  commitMessage: "🚀 MàJ automatique depuis Codex",
  pr: {
    autoCreate: true,
    base: "main",
    title: "✨ Auto-PR via Codex",
    body: "Synchronisation automatique avec la branche `main`.",
    autoMerge: true,
  },
};
