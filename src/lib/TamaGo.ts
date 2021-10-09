/*
 * Notes
 * - 16-bit, 96kHz CPU
 * - 8-bit bytes, 16-bit words
 * - 8-bit registers
 * - 2768 general purpose RAM
 * - 256 byte stack
 * - TILE and SPRITE in addition to DRAW
 * - Refactor registers, add register symbols
 * - Audit stack and memory instructions
 */


/*
 * Constants
 */



/*
 * Enumerators
 */

export enum InstructionCode {
  /*
   * Notes:
   * - Anytime a value is 'pushed' to the Stack, STACK_POINTER will be incremented by 1 unless otherwise noted
   * - Anytime a 'jump' instruction is executed, the value of the Program Counter will be pushed to the Stack, and the index copied to RETURN_POINTER
   */

  /* Stack operations */
  CONST,  // Pushes `value` onto the Stack
          // `CONST <value: Integer>`
  PUSH,   // Pushes the value of `register` onto the Stack
          // `PUSH <register: Symbol>`
  POP,    // Copies the last value of the Stack to `register` and decrements STACK_POINTER
          // `POP <register: Symbol>`
  COPY,   // Copies the last value of the Stack to `register`
          // `COPY <register: Symbol>`
  INCR,   // Increments STACK_POINTER by `value`
          // `INCR <value: Integer>`
  DECR,   // Decrements STACK_POINTER by `value`
          // `DECR <value: Integer>`

  /* Arthimetic operations */
  ADD,    // Pushes to the Stack the result of adding the last two values on the Stack
          // `ADD`
  SUB,    // Pushes to the Stack the result of subtracting the last two values on the Stack
          // `SUB`
  MUL,    // Pushes to the Stack the result of multiplying the last two values on the Stack
          // `MUL`
  DIV,    // Pushes to the Stack the result of dividing (rounded) the last two values on the Stack
          // `DIV`
  MOD,    // Pushes to the Stack the modulo the last two values on the Stack
          // `MOD`

  /* Bitwise operations */
  AND,    // Pushes to the Stack the result bitwise anding the last two values on the Stack
          // `AND`
  OR,     // Pushes to the Stack the result bitwise oring the last two values on the Stack
          // `OR`
  XOR,    // Pushes to the Stack the result bitwise xoring the last two values on the Stack
          // `XO`
  NOT,    // Pushes to the Stack the result bitwise noting the top of the Stack
          // `NOT`
  LSHFT,  // Pushes to the Stack the result left-shifting the last two values on the Stack
          // `LSHFT`
  RSHFT,  // Pushes to the Stack the result right-shifting the last two values on the Stack
          // `RSHFT`
  
  /* Register operations */
  SET,    // Copies `value` to DATA_BUFFER_A
          // `SET <value: Integer>`
  GET,    // Copies the value from `register` to DATA_BUFFER_A
          // `GET <register: Symbol>
  MOV,    // Copies the value from DATA_BUFFER_A to `register`
          // `MOV <register: Symbol>`

  /* Memory operations */
  MADDR,  // Copies the the index of the second last value on the Stack to MEMORY_POINTER
          // `MADDR`
  PEEK,   // Copies the value from the Memory Pointer address to `register`
          // `PEEK <register: Symbol>`
  POKE,   // Copies the value from `register` to the Memory Pointer address
          // `POKE <register: Symbol>`

  /* Save Data operations */
  SAVE,   // Copies Save Data from memory into Local Storage
          // `SAVE`
  LOAD,   // Copies Save Data from Local Storage into memory
          // `LOAD`

  /* Storage operations */
  SADDR,  // Copies the the index of the second last value on the Stack to STORAGE_POINTER
          // `SADDR`
  READ,   // Copy a range of values from Storage to the Memory Pointer address, starting at the Storage Pointer address
          // `READ <numberOfBytes: Integer>`

  /* Jump operations */
  GOTO,   // Copies the the last two values on the Stack to PROGRAM_COUNTER_HIGH and PROGRAM_COUNTER_LOW
          // `GOTO`
  LABEL,  // Copies the current Program Counter address into memory (0-127)
          // `LABEL <label: Integer>`
  JUMP,   // Copies the next two values in memory at the index specified by the address `label` refers too, to PROGRAM_COUNTER_HIGH and PROGRAM_COUNTER_LOW
          // `JUMP <label: Integer>`
  RTN,    // Copies the next two values on the Stack at the index specified by RETURN_POINTER to PROGRAM_COUNTER_HIGH and PROGRAM_COUNTER_LOW
          // `RTN`
  JEQ,    // Compares the last two values on the Stack; executes a 'jump' if COMPARE_VALUE_A equals COMPARE_VALUE_B
          // `JEQ <label: Integer>`
  JNEQ,   // Compares the last two values on the Stack; executes a 'jump' if COMPARE_VALUE_A does not equal COMPARE_VALUE_B
          // `JNEQ <label: Integer>`
  JGT,    // Compares the last two values on the Stack; executes a 'jump' if COMPARE_VALUE_A is greater than COMPARE_VALUE_B
          // `JGT <label: Integer>`
  JGTE,   // Compares the last two values on the Stack; executes a 'jump' if COMPARE_VALUE_A is greater than or equals COMPARE_VALUE_B
          // `JGTE <label: Integer>`
  JLT,    // Compares the last two values on the Stack; executes a 'jump' if COMPARE_VALUE_A is less than COMPARE_VALUE_B
          // `JLT <label: Integer>`
  JLTE,   // Compares the last two values on the Stack; executes a 'jump' if COMPARE_VALUE_A is less than or equals COMPARE_VALUE_B
          // `JLTE <label: Integer>`

  /* Input operations */
  BTN,    // Pushes the current state of the specified button to the Stack; high value if just pressed
          // `BTN <whichButton: Integer>`
  BTND,   // Pushes the current state of the specified button to the Stack; high value if pressed
          // `BTND <whichButton: Integer>`
  TICK,   // Pushes the current frame tick to the Stack
          // `TICK`
  
  /* Serial port operations */
  PIN,    // Pushes the state of the specified `pinNumber` to the Stack (0-15)
          // `PIN <pinNumber: Integer>`
  POUT,   // Copies the value of the last item on the Stack to the specified `pinNumber` (0-15)
          // `POUT <pinNumber: Integer>`

  /* Drawing operations */
  CLEAR,  // Fills video memory with the value of the last item on the Stack
          // `CLEAR`
  DRAW,   // 
          // `DRAW`
  SHADE,  // 
          // `SHADE`
  TILE,   // 
          // `TILE`
  SPR,    // 
          // `SPR`
  ICON,   // 
          // `ICON`

  /* Audio operations */
  TONE,   // 
          // `TONE`

  /* Misc. operations */
  SLEEP,  // 
          // `SLEEP`
  WAKE,   // 
          // `WAKE`
  PRINT,  // 
          // `PRINT <register: Symbol>`
  NOP     // 
          // `NOP`
}

// export const InstructionCode: Instruction[] = Object
//   .keys(Instruction)
//   .map((key) => (Instruction as any)[key])

// export const InstructionCodeMap: { [key: number]: Instruction } = Object
//   .keys(Instruction)
//   .reduce<{ [key: number]: Instruction }>((acc, key, i) => (acc[i] = (Instruction as any)[key], acc), {})

export enum Register {
  DATA_BUFFER_A         = 'xa',
  DATA_BUFFER_B         = 'xb',
  PROGRAM_COUNTER_HIGH  = 'pc0',
  PROGRAM_COUNTER_LOW   = 'pc1',
  STACK_POINTER         = 'sap',
  MEMORY_POINTER        = 'mep',
  STORAGE_POINTER       = 'sop',
  RETURN_POINTER        = 'rep'
}


/*
 * Types
 */

export type MemoryAddress = [
  number,
  number
]


/*
 * Class
 */

export default class TamaGo {
  // State
  running: boolean = false

  // Icons
  icons: string[] = []

  // Background cutout
  cutout: ImageData | undefined

  // 2 768 bytes of memory
  memory: Uint8ClampedArray = new Uint8ClampedArray(2768)

  // 65 536 bytes of flash
  storage: Uint8ClampedArray = new Uint8ClampedArray(65536)

  // Registers
  registers: { [key: string]: number } = {
    STACK_POINTER: 0,
    DATA_BUFFER_A: 0,
    DATA_BUFFER_B: 0,
    PROGRAM_COUNTER_LOW: 0,
    PROGRAM_COUNTER_HIGH: 0,
    MEMORY_POINTER_LOW: 0,
    MEMORY_POINTER_HIGH: 0,
    STORAGE_POINTER_LOW: 0,
    STORAGE_POINTER_HIGH: 0,
    COMPARE_VALUE_A: 0,
    COMPARE_VALUE_B: 0
  }

  constructor () {
    this.reset()
  }

  reset () {
    // this.memory.fill(0)
    // this.storage.fill(0)
  }

  run () {

  }

  pause () {

  }

  cycle () {

  }

  pushToStack (value: number) {
  }

  getFromStack (index?: number) {
  }

  executeInstruction (instructionCode: number, parameter: number = 0) {
    // switch (InstructionCode[instructionCode] as Instruction) {
      
    // }
  }

  loadProgram (program: string) {

  }

  setCutout (data: ImageData) {

  }
}
