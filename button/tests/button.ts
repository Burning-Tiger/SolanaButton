import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Button } from "../target/types/button";
import { PublicKey } from "@solana/web3.js";

describe("button", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Button as Program<Button>;

  const [counterPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from("counter")],
    program.programId,
  );
 
  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods
    .initialize()
    .accounts(counterPDA)
    .rpc({ skipPreflight: true });
    console.log("Your transaction signature", tx);


  //   // Fetch the counter account data
  //   const accountData = await program.account.counter.fetch(counterPDA);
  //   console.log(`Count: ${accountData.clickCount}`);
  // });
  it("Increment", async () => {
    // Invoke the increment instruction
    const transactionSignature = await program.methods
      .click()
      .accounts({
        counter: counterPDA,
      })
      .rpc();
 
    // Fetch the counter account data
    const accountData = await program.account.counter.fetch(counterPDA);
 
    console.log(`Transaction Signature: ${transactionSignature}`);
    console.log(`Count: ${accountData.clickCount}`);
  });
});
