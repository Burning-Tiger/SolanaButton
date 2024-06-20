use anchor_lang::prelude::*;

declare_id!("7cweAkBzN7RhVkPUcL2UC1c4CAE4M6SJ63rwNoU4qRoB");

#[program]
pub mod button {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        // Reference to the counter account from the Initialize struct
        let counter = &mut ctx.accounts.counter;
        counter.bump = ctx.bumps.counter; // store bump seed in `Counter` account        
        msg!("Click count account created! Current count: {}", counter.click_count);
        Ok(())
    }
    // Instruction to increment a counter account
    pub fn click(ctx: Context<Click>) -> Result<()> {
        // Mutable reference to the counter account from the Increment struct
        let counter = &mut ctx.accounts.counter;
 
        // Increment the count value stored on the counter account by 1
        counter.click_count = counter.click_count.checked_add(1).unwrap();
        msg!("Counter incremented! Current count: {}", counter.click_count);
        Ok(())
    }
}

// Accounts required by the initialize instruction
#[derive(Accounts)]
pub struct Initialize<'info> {
    // The account paying to create the counter account
    #[account(mut)]
    pub user_init: Signer<'info>, // specify account must be signer on the transaction
 
    // The counter account being created and initialized in the instruction
    #[account(
        init,         // specifies we are creating this account
        payer = user_init, // specifies account paying for the creation of the account
        seeds = [b"counter"], // optional seeds for pda
        bump,                 // bump seed for pda
        space = 8 + Counter::INIT_SPACE
    )]
    pub counter: Account<'info, Counter>, // specify account is 'Counter' type
    pub system_program: Program<'info, System>, // specify account must be System Program
}

#[derive(Accounts)]
pub struct Click<'info> {
    #[account(
        mut,                  // specify account is mutable because we are updating its data
        seeds = [b"counter"], // optional seeds for pda
        bump = counter.bump,  // bump seed for pda stored in `Counter` account
    )] 
    pub counter: Account<'info, Counter> 
}

#[account]
#[derive(InitSpace)]
pub struct Counter {
    pub click_count: u64, // define count value type as u64
    pub bump: u8,   // 1 byte
}