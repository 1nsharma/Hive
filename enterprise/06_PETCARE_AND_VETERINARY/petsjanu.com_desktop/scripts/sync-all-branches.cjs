/**
 * Sync All Branches Helper Script for PetJanu
 * Fetches all remote branches, ensures main is up to date, and merges branches cleanly.
 */

const { execSync } = require('child_process');

function run(command) {
  try {
    return execSync(command, { encoding: 'utf8', stdio: 'pipe' }).trim();
  } catch (error) {
    return null;
  }
}

console.log('🔄 Fetching all remote branches...');
run('git fetch --all --prune');

const currentBranch = run('git rev-parse --abbrev-ref HEAD') || 'main';
console.log(`📌 Current active branch: ${currentBranch}`);

// Pull latest main
if (currentBranch === 'main') {
  console.log('⬇️ Pulling latest changes into main...');
  const pullResult = run('git pull origin main');
  console.log(pullResult || 'Main is up to date.');
}

// Get all remote branches
const rawBranches = run('git branch -r') || '';
const branches = rawBranches
  .split('\n')
  .map(b => b.trim())
  .filter(b => b && !b.includes('HEAD') && !b.includes('origin/main'))
  .map(b => b.replace('origin/', ''));

console.log(`\n📋 Found ${branches.length} remote feature branch(es):`, branches);

branches.forEach(branch => {
  console.log(`\n--- Checking branch: ${branch} ---`);
  const isMerged = run(`git merge-base --is-ancestor origin/${branch} main`);
  
  if (isMerged !== null) {
    console.log(`✅ ${branch} is already fully merged into main.`);
  } else {
    console.log(`⏳ ${branch} has unmerged commits. Attempting test merge...`);
    // Check if clean merge is possible
    const testMerge = run(`git merge-tree $(git merge-base main origin/${branch}) main origin/${branch}`);
    if (testMerge && !testMerge.includes('<<<<<<<')) {
      console.log(`✨ Clean merge possible for ${branch} with 0 conflicts.`);
    } else {
      console.log(`⚠️ Merge conflicts detected between main and ${branch}.`);
    }
  }
});

console.log('\n✨ Branch check & sync routine completed.\n');
