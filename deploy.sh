#!/bin/bash

# Check for required commands
for cmd in jq npm graph; do
    if ! command -v $cmd &> /dev/null; then
        echo "$cmd could not be found, please install it."
        exit 1
    fi
done

# Variables
SUBGRAPH_NAME="subgraph"                      # Subgraph name from command line argument
CONTRACT_NAME=DAIToken
CONTRACT_ADDRESS=0x422A3492e218383753D8006C7Bfa97815B44373F                     # Contract address from command line argument
FILE_NAME=DAI.sol
JSON_FILE="./artifacts/contracts/$FILE_NAME/$CONTRACT_NAME.json"  # Path to the JSON file
ABI_FILE="./abi.json"                      # Output file for ABI
NETWORK_NAME=mainnet                         # Use a valid network name instead of URL
PROTOCOL=ethereum
PRODUCT=subgraph-studio
# Step 1: Extract ABI from JSON file
echo "Extracting ABI from $JSON_FILE..."
jq '.abi' "$JSON_FILE" > "$ABI_FILE"

jq --arg SUBGRAPH_NAME "$SUBGRAPH_NAME" '. + {workspaces: [$SUBGRAPH_NAME]}' package.json > tmp.$$.json && mv tmp.$$.json package.json
# Step 2: Initialize Subgraph
echo "Initializing subgraph..."
if ! graph init devstar1014/$SUBGRAPH_NAME --protocol $PROTOCOL --product $PRODUCT --from-contract $CONTRACT_ADDRESS --start-block 0 --network mainnet --abi "$ABI_FILE" --contract-name $CONTRACT_NAME  --index-events --allow-simple-name $SUBGRAPH_NAME; then
    echo "Failed to initialize subgraph."
    exit 1 
fi
# graph init devstar1014/"$SUBGRAPH_NAME" --from-contract "$CONTRACT_ADDRESS" --network "$NETWORK_NAME" --abi "$ABI_FILE"
# Step 3: Change directory to the new subgraph folder
cd "$SUBGRAPH_NAME" || { echo "Subgraph directory not found."; exit 1; }

# Step 4: Deploy the Subgraph
echo "Deploying subgraph..."
npm run codegen || { echo "Code generation failed."; exit 1; }
npm run build || { echo "Build failed."; exit 1; }
npm run create-local || { echo "Local creation failed."; exit 1; }

# npm run deploy-local || { echo "Deployment failed."; exit 1; }
graph deploy --node http://localhost:8020/ --ipfs http://localhost:5001 -l v0.0.1 devstar1014/$SUBGRAPH_NAME
echo "Subgraph deployment complete."