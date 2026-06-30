const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const profile = process.argv[2];
if (!profile) {
  console.error("Error: Please provide a valid target profile argument (development, preview, production).");
  process.exit(1);
}

const REMOTE_IP = "100.97.129.79";
const USER = "jungleebulla";
const SCRIPT_PATH = "~/build_selectSwitch_runner.sh";
const LOCAL_BUILD_DIR = path.join(__dirname, "android-builds");

try {
  // Ensure the parallel destination directory exists locally
  if (!fs.existsSync(LOCAL_BUILD_DIR)) {
    fs.mkdirSync(LOCAL_BUILD_DIR, { recursive: true });
  }

  console.log(`\nEstablishing SSH connection to build host (${USER}@${REMOTE_IP}) for profile: ${profile}...`);

  // Invoke the customized selectSwitch runner script on the host instance
  execSync(`ssh ${USER}@${REMOTE_IP} "bash ${SCRIPT_PATH} ${profile}"`, {
    stdio: "inherit",
  });

  console.log(`\nRemote task layer finished. Initiating secure asset collection copy...`);

  // Pull down target file groupings matching runtime parameters
  if (profile === "production") {
    execSync(`scp ${USER}@${REMOTE_IP}:~/Bablus/android/*.aab "${LOCAL_BUILD_DIR}/"`, {
      stdio: "inherit",
    });
  } else {
    execSync(`scp ${USER}@${REMOTE_IP}:~/Bablus/android/*.apk "${LOCAL_BUILD_DIR}/"`, {
      stdio: "inherit",
    });
  }

  console.log(`\nSuccess! Staged assets successfully localized inside: "${LOCAL_BUILD_DIR}"`);
} catch (error) {
  console.error(`\nBuild runner execution crashed during execution lifecycle loops.`);
  process.exit(1);
}