const { execSync } = require("child_process");

// Get the target profile parameter from the node runtime process arguments
const profile = process.argv[2];
if (!profile) {
  console.error(
    "Error: Please provide a build profile (development, preview, production).",
  );
  process.exit(1);
}

const REMOTE_IP = "100.97.129.79";
const USER = "jungleebulla";
const SCRIPT_PATH = "~/build_selectSwitch_runner.sh";

try {
  console.log(
    `\nConnecting to remote builder (${USER}@${REMOTE_IP}) for profile: ${profile}...`,
  );

  // Execute the remote automation shell script via SSH
  execSync(`ssh ${USER}@${REMOTE_IP} "bash ${SCRIPT_PATH} ${profile}"`, {
    stdio: "inherit",
  });

  console.log(`\nRemote build succeeded. Fetching the generated binary...`);

  // Download the built APK asset from the clean remote directory into your local folder
  execSync(
    `scp ${USER}@${REMOTE_IP}:~/Select-Switch-Mobile-App/android/*.apk ./android-builds/`,
    { stdio: "inherit" },
  );

  console.log(
    `\nSuccess! Downloaded asset files can be found in the local "./android-builds/" directory.`,
  );
} catch (error) {
  console.error(`\nBuild sequence failed during runtime execution.`);
  process.exit(1);
}