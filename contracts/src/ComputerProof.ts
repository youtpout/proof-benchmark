import { CircuitString, Field, Poseidon, Struct, UInt64, ZkProgram } from "o1js";

export class ComputerInfo extends Struct({
    model: CircuitString, cpu: CircuitString, os: CircuitString,
    browser: CircuitString, hardwareConcurrency: UInt64
}) {
    constructor(
        model: CircuitString,
        cpu: CircuitString,
        os: CircuitString,
        browser: CircuitString,
        hardwareConcurrency: UInt64
    ) {
        super({ model, cpu, os, browser, hardwareConcurrency });
    }

    hash() {
        const concat = [this.model.hash(), this.cpu.hash(), this.os.hash(), this.browser.hash()].concat(this.hardwareConcurrency.toFields());
        return Poseidon.hash(concat);
    }

}

export const computerProof = ZkProgram({
    name: 'computer-proof',
    publicInput: ComputerInfo,

    methods: {
        bench: {
            privateInputs: [],

            async method(input: ComputerInfo) {
                input.hardwareConcurrency.assertGreaterThan(UInt64.zero);
                input.model.length().assertGreaterThan(Field(0));
                input.cpu.length().assertGreaterThan(Field(0));
                input.os.length().assertGreaterThan(Field(0));
                input.browser.length().assertGreaterThan(Field(0));

                const cal = UInt64.from(300).mul(UInt64.from(1500)).div(UInt64.from(100)).add(UInt64.from(15)).sub(UInt64.from(28));
                cal.assertEquals(UInt64.from(4487))
                cal.assertGreaterThan(UInt64.from(500))
                cal.assertLessThan(UInt64.from(5000))

                const concat = [input.model.hash(), input.cpu.hash(), input.os.hash(), input.browser.hash()].concat(input.hardwareConcurrency.toFields());
                const hash = Poseidon.hash(concat);
                hash.assertEquals(input.hash());
            },
        },
    },
});

export let ComputerProof_ = ZkProgram.Proof(computerProof);
export class ComputerProof extends ComputerProof_ { }