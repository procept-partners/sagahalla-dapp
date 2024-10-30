
# Instructions for Creating NEAR Testnet Account IDs Using Docker and `near-cli`

This guide will walk you through the steps required to create account IDs on the NEAR Testnet. It assumes that Docker is installed and the `near-cli` is added as a dependency in your project.

## Prerequisites

1. **Docker Installed**: Ensure Docker is installed and running on your system.
2. **Project Setup**: The project is set up, and `near-cli` is included as a dev dependency in the `package.json`.

## Steps

### 1. Launch the Docker Container

Make sure you are inside the Docker container where the project is set up.

```bash
docker exec -it <container_name> /bin/bash
```

Replace `<container_name>` with the name of your Docker container.

### 2. Install Dependencies

If you haven’t installed the project dependencies yet, run the following command:

```bash
npm install
```

This will install `near-cli` and other necessary dependencies from the `package.json`.

### 3. Verify `near-cli` Installation

You can check if `near-cli` is installed by running:

```bash
npx near --version
```

If installed successfully, you should see the version of `near-cli`.

### 4. Generate a Key Pair for Your Testnet Account

To create an account on the NEAR Testnet, first generate a key pair. The key pair will be saved in a credentials folder (`/root/.near-credentials/testnet` by default).

Run the following command to generate a key pair for the account:

```bash
npx near generate-key <your-account-id>.testnet --networkId testnet --nodeUrl https://rpc.testnet.near.org
```

For example, to generate a key for `sagahalla.testnet`, run:

```bash
npx near generate-key sagahalla.testnet --networkId testnet --nodeUrl https://rpc.testnet.near.org
```

### 5. Verify Key Pair Generation

The key pair is stored in the `/root/.near-credentials/testnet/` directory. To verify that the key was generated, list the contents of that directory:

```bash
ls /root/.near-credentials/testnet/
```

You should see a JSON file with the name of the account you just generated (e.g., `sagahalla.testnet.json`).

### 6. View the Private Key

To view the contents of the key pair file, including the private key, run:

```bash
cat /root/.near-credentials/testnet/<your-account-id>.testnet.json
```

For example:

```bash
cat /root/.near-credentials/testnet/sagahalla.testnet.json
```

This will output something like:

```json
{
  "account_id": "sagahalla.testnet",
  "public_key": "ed25519:8tn6M5Eb8MwfZrsEyAWLiB3YfFjFwxLrTWSgt2ZEdMoU",
  "private_key": "ed25519:YOUR_PRIVATE_KEY_HERE"
}
```

### 7. Move the Key Pair File to Your Current Directory (Optional)

If you need to move the key file to your current working directory, run the following command:

```bash
mv /root/.near-credentials/testnet/sagahalla.testnet.json /path/to/your/current/directory/
```

If you are already in the correct directory, move it like this:

```bash
mv /root/.near-credentials/testnet/sagahalla.testnet.json .
```

### 8. Check the State of the Account on NEAR Testnet

Once the account is funded or activated, you can check its state using:

```bash
npx near state <your-account-id>.testnet --networkId testnet --nodeUrl https://rpc.testnet.near.org
```

For example:

```bash
npx near state sagahalla.testnet --networkId testnet --nodeUrl https://rpc.testnet.near.org
```

This will show the balance and status of the account on the testnet.

### 9. Import the Private Key into NEAR Wallet

To access your account via the NEAR Testnet Wallet, follow these steps:

1. Go to [NEAR Testnet Wallet](https://testnet.mynearwallet.com/).
2. Click on **"Import Account"**.
3. Choose the **Private Key** option and paste the private key you obtained from the `sagahalla.testnet.json` file.

Once imported, you'll have access to the `sagahalla.testnet` account through the NEAR Testnet Wallet.

## Summary of Commands

- **Launch Docker container**:  
  ```bash
  docker exec -it <container_name> /bin/bash
  ```

- **Install dependencies**:  
  ```bash
  npm install
  ```

- **Generate a key pair for testnet**:  
  ```bash
  npx near generate-key sagahalla.testnet --networkId testnet --nodeUrl https://rpc.testnet.near.org
  ```

- **View generated key pair**:  
  ```bash
  cat /root/.near-credentials/testnet/sagahalla.testnet.json
  ```

- **Move the key file**:  
  ```bash
  mv /root/.near-credentials/testnet/sagahalla.testnet.json .
  ```

- **Check account state**:  
  ```bash
  npx near state sagahalla.testnet --networkId testnet --nodeUrl https://rpc.testnet.near.org
  ```

---

Let me know if you need further modifications or additional steps!
