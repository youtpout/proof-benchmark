import { Field, SmartContract, state, State, method, UInt64, Struct, FlexibleProvablePure } from 'o1js';
import { ComputerInfo, ComputerProof } from './ComputerProof';


export class BenchmarkEvent extends Struct({
  computerInfo: ComputerInfo, time: UInt64
}) {
  constructor(
    computerInfo: ComputerInfo, time: UInt64
  ) {
    super({ computerInfo, time });
  }

}

export class Benchmark extends SmartContract {

  events = { "add": BenchmarkEvent };

  init() {
    super.init();
  }

  @method async addBenchmark(computerProof: ComputerProof, time: UInt64) {
    computerProof.verify();
    this.emitEvent("add", new BenchmarkEvent(computerProof.publicInput, time));
  }
}
