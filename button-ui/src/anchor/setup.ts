import {  Program, AnchorProvider, Wallet } from '@coral-xyz/anchor';
import { Connection, clusterApiUrl } from '@solana/web3.js';
import { computed } from 'vue'
import { useAnchorWallet } from 'solana-wallets-vue';
import { ref, Ref } from 'vue';
// These two are manually copied from the target folder of the Button project.
import { Button } from "./idl";
import idl from './button.json';

//TODO : get clusterApiUrl solana-wallets-vue and follow the changes instead of hardcoded?

export const program : Ref<Program<Button> | null>= ref(null);

export const initProgram = () => {
  console.log("START initProgram");
  const preflightCommitment = "processed";
  const commitment = "confirmed";
  const wallet = useAnchorWallet();  
  const connection = new Connection(clusterApiUrl("devnet"), commitment);
  const cProgram = computed(() => new Program(idl as Button, provider.value))
  const provider = computed(
    () =>
      new AnchorProvider(connection, wallet.value as Wallet, {
        preflightCommitment,
        commitment,
      })
  );
  program.value = cProgram.value
  console.log("END initProgram");
}