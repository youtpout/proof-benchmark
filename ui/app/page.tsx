'use client';
import { Field } from 'o1js';
import { useEffect, useState } from 'react';
import GradientBG from '../components/GradientBG';
import styles from '../styles/Home.module.css';
import './reactCOIServiceWorker';
import ZkappWorkerClient from './zkappWorkerClient';
import { stat } from 'fs';

let transactionFee = 0.1;
const ZKAPP_ADDRESS = 'B62qpXPvmKDf4SaFJynPsT6DyvuxMS9H1pT4TGonDT26m599m7dS9gP';

export default function Home() {
  const [zkappWorkerClient, setZkappWorkerClient] = useState<null | ZkappWorkerClient>(null);
  const [hasBeenSetup, setHasBeenSetup] = useState(false);
  const [creatingTransaction, setCreatingTransaction] = useState(false);
  const [displayText, setDisplayText] = useState('');

  const displayStep = (step: string) => {
    setDisplayText(step)
    console.log(step)
  }

  // -------------------------------------------------------
  // Do Setup

  useEffect(() => {
    const setup = async () => {
      try {
        if (!hasBeenSetup) {
          displayStep('Loading web worker...')
          const zkappWorkerClient = new ZkappWorkerClient();
          setZkappWorkerClient(zkappWorkerClient);
          await new Promise((resolve) => setTimeout(resolve, 5000));
          displayStep('Done loading web worker')


          await zkappWorkerClient.loadContract();

          displayStep('Compiling zkApp...');
          await zkappWorkerClient.compileContract();
          displayStep('zkApp compiled');


          setHasBeenSetup(true);
          setDisplayText('');

        }
      } catch (error: any) {
        displayStep(`Error during setup: ${error.message}`);
      }
    };

    setup();
  }, []);



  // -------------------------------------------------------
  // Send a transaction

  const onSendTransaction = async () => {
    setCreatingTransaction(true);

    displayStep('Launch benchmark...');
    console.time("benchmark")
    const transactionJSON = await zkappWorkerClient!.launchBenchmark();
    console.timeEnd("benchmark")

    await getState();

    setCreatingTransaction(false);
  };

  useEffect(() => {
    if (creatingTransaction) {
      const interval = setInterval(() => {
        getState().then();
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [creatingTransaction]);

  async function getState() {
    const state = await zkappWorkerClient?.getBenchmarkState() || "";
    displayStep(state);
  }


  // -------------------------------------------------------
  // Create UI elements

  let setup = (
    <div
      className={styles.start}
      style={{ fontWeight: 'bold', fontSize: '1.5rem', paddingBottom: '5rem' }}
    >
      {displayText}
    </div>
  );

  let mainContent;
  if (hasBeenSetup) {
    mainContent = (
      <div style={{ justifyContent: 'center', alignItems: 'center' }}>
        <button
          className={styles.card}
          onClick={onSendTransaction}
          disabled={creatingTransaction}
        >
          Launch benchmark
        </button>
      </div>
    );
  }

  return (
    <GradientBG>
      <div className={styles.main} style={{ padding: 0 }}>
        <div className={styles.center} style={{ padding: 0 }}>
          {setup}
          {mainContent}
        </div>
      </div>
    </GradientBG>
  );
}