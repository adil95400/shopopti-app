module.exports = {
  commands: {
    default: async () => {
      const msg = await prompt("📝 Message du commit ?");
      await $`git add .`;
      await $`git commit -m ${msg}`;
      await $`git push`;

      const branch = (await $`git branch --show-current`).stdout.trim();
      const url = (await $`gh repo view --json url -q ".url"`).stdout.trim();
      const prExists = (await $`gh pr list --head ${branch} --json url -q ".[]?.url"`).stdout.trim();

      if (!prExists) {
        await $`gh pr create --base main --head ${branch} --title ${msg} --body "PR auto via Bolt"`;
      }

      await $`gh pr merge --auto --squash`;
    },
  },
};
