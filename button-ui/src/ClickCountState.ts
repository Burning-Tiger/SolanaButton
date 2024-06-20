import { ref, watch } from 'vue';
import { PublicKey} from '@solana/web3.js';
import { program } from './anchor/setup';
import { useWallet } from 'solana-wallets-vue';
import { BN } from '@coral-xyz/anchor';

//First we declare and export our observable number
export const clickCount = ref(0);

var previousSubscriptionId :number; 

// Second, we listen to any change of program to re-initialise the state : 
watch(program, async (_newValue, oldProgram) => {
  console.info("program changed, need to re-initialise the buttonState");
  if(previousSubscriptionId){
    //We need to unsubscribe first!
    if(oldProgram){
      var oldConnection = oldProgram.provider.connection;
      await oldConnection.removeAccountChangeListener(previousSubscriptionId);
      console.info("removeAccountChangeListener done!");
    }
  }
  await initAndSubscribe_ClickCount();
});

let initAndSubscribe_ClickCount = async () => {
  if(program.value == null){
    console.log('No Program yet, aborting..');
    return;
  }
  const programInstance = program.value ;
  // Getting initial value from the blockchain :
  const counterAccountPubKey = PublicKey.findProgramAddressSync([Buffer.from("counter")], programInstance.programId)[0];
  const counterAccount = await programInstance.account.counter.fetch(counterAccountPubKey);
  clickCount.value =  counterAccount.clickCount.toString();

  //Getting update from Ws events :
  var connection = programInstance.provider.connection;
  previousSubscriptionId = connection.onAccountChange(
    // The address of the account we want to watch
    counterAccountPubKey,
    // callback for when the account changes
    accountInfo => {
      var result :any = programInstance.coder.accounts.decode("counter", accountInfo.data);
      console.info("account changed !");
      clickCount.value = (result.clickCount as BN).toNumber();
    },
  );
};

//Finally we define the click method that send the click transaction to Solana Network
export const click = async () => {
  if(program.value == null){
    console.log('Not connect to a Solana yet, please init the workspace');
    return;
  }

  const { publicKey, sendTransaction } = useWallet();
  if (!publicKey.value) {
    console.log('Not connect to a wallet yet');
    return;
  }

  var connection = program.value.provider.connection;
  var transaction = await program.value.methods.click().transaction();  

  const signature = await sendTransaction(transaction, connection);
  console.log("Click SENT : ",signature);
};