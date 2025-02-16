import { Field, Mina, PublicKey, fetchAccount } from 'o1js';
import * as Comlink from "comlink";
import type { Add } from '../../contracts/src/Add';
import { fetchFiles, readCache } from './cache';

const state = {
  AddInstance: null as null | typeof Add,
  proofJson: null as null | string,
  benchmarkState: null as null | string,
  time: null as null | number,
};

export const api = {
  async loadContract() {
    const { Add } = await import('../../contracts/build/src/Add.js');
    state.AddInstance = Add;
  },
  async compileContract() {
    const cacheFiles = await fetchFiles();
    const cache = readCache(cacheFiles);

    await state.AddInstance!.compile({ cache });
  },
  async launchBenchmark() {
    const timeStart = Date.now();
    console.time("add");
    state.benchmarkState = "benchmarking ...";
    const { proof: proof0 } = await state.AddInstance!.init(Field(0));
    state.benchmarkState = "first proof generated, generating second proof ...";
    const { proof: proof1 } = await state.AddInstance!.addNumber(Field(4), proof0, Field(4));
    state.benchmarkState = "second proof generated, generating last proof ...";
    const { proof: proof2 } = await state.AddInstance!.add(Field(4), proof1, proof0);
    console.timeEnd("add");
    const timeEnd = Date.now();
    const during = timeEnd - timeStart;
    state.benchmarkState = "Benchmark end in " + during / 1000 + " s";
    state.proofJson = JSON.stringify(proof2.toJSON());
    state.time = during;
  },
  async getBenchmarkState() {
    return state.benchmarkState;
  },
  async getTime() {
    return state.time;
  }
};

// Expose the API to be used by the main thread
Comlink.expose(api);
