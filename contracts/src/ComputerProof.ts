import { CircuitString, Field, Struct, UInt64, ZkProgram } from "o1js";

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
            },
        },
    },
});

export let ComputerProof_ = ZkProgram.Proof(computerProof);
export class ComputerProof extends ComputerProof_ { }