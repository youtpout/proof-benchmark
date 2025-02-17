'use client';
import { Field } from 'o1js';
import { useEffect, useState } from 'react';
import GradientBG from '../components/GradientBG';
import styles from '../styles/Home.module.css';
import './reactCOIServiceWorker';
import ZkappWorkerClient from './zkappWorkerClient';
import { createClient } from '@supabase/supabase-js'



let transactionFee = 0.1;
const ZKAPP_ADDRESS = 'B62qpXPvmKDf4SaFJynPsT6DyvuxMS9H1pT4TGonDT26m599m7dS9gP';

export default function Home() {
  const [zkappWorkerClient, setZkappWorkerClient] = useState<null | ZkappWorkerClient>(null);
  const [hasBeenSetup, setHasBeenSetup] = useState(false);
  const [creatingTransaction, setCreatingTransaction] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const [time, setTime] = useState(0);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    model: "",
    cpu: ""
  });

  const displayStep = (step: string) => {
    setDisplayText(step)
    console.log(step)
  }


  // Create a single supabase client for interacting with your database
  const supabase = createClient('https://heinegxlzmatuyvslqnz.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhlaW5lZ3hsem1hdHV5dnNscW56Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk3MDAzNzQsImV4cCI6MjA1NTI3NjM3NH0.Z0IATzKModUJ1GjYlsRGAx6Y7k3QjmvHXJdM8HnhKGg');

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
    try {
      setCreatingTransaction(true);

      displayStep('Launch benchmark...');
      console.time("benchmark")
      const transactionJSON = await zkappWorkerClient!.launchBenchmark();
      console.timeEnd("benchmark")

      await getState();

      const timeBenchmark = await zkappWorkerClient!.getTime();
      setTime(timeBenchmark);
    } catch (error) {
      console.log(error);
    } finally {
      setCreatingTransaction(false);
    }
  };

  const saveData = async () => {
    try {
      if (!(data.model && data.cpu)) {
        alert("No model or cpu set");
        return;
      }
      setLoading(true);
      const navigator = window.navigator;
      const dataTosave = {
        model: data.model,
        cpu: data.cpu,
        platform: navigator.platform,
        userAgent: navigator.userAgent,
        hardwareConcurrency: navigator.hardwareConcurrency,
        time: time
      };

      const res = await fetch("/api/data", {
        "headers": {
          "content-type": "application/json"
        },
        "body": JSON.stringify(dataTosave),
        "method": "POST"
      })

      if (res.ok) {
        setTime(0);
        const result = await res.text();
        console.info(result);
      } else {
        const result = res.statusText;
        console.error(result);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }

  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (creatingTransaction) {
        getState().then();
      }
    }, 1000);
    return () => clearInterval(interval);
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
        <div className='flexRow'>
          <span style={{ width: "80px", display: "inline-block" }}>Model : </span>
          <input className='input-text' type='text' value={data.model} onChange={(ev) => setData({ ...data, model: ev.target.value })}></input>
        </div>
        <div className='flexRow'>
          <span style={{ width: "80px", display: "inline-block" }}>Cpu : </span>
          <input className='input-text' type='text' value={data.cpu} onChange={(ev) => setData({ ...data, cpu: ev.target.value })}></input>
        </div>
        {!time ?
          <button className={styles.card} onClick={onSendTransaction} disabled={creatingTransaction}>{creatingTransaction ? "Benchmarking ..." : "Launch benchmark"}</button>
          : <button className={styles.card} onClick={saveData} disabled={loading}> {loading ? "Saving ..." : "Save data"}  </button>}
        <div>
          we save model/cpu/user agent/platform/cpu threads <br /> we don't save ip or any other private informations
        </div>
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