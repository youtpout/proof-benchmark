'use client';
import { useEffect, useState } from 'react';
import GradientBG from '../../components/GradientBG';
import styles from '../../styles/Home.module.css';
import { createClient } from '@supabase/supabase-js'

export default function Home() {
    const [tabs, setTabs] = useState([]);


    // Create a single supabase client for interacting with your database
   
    // -------------------------------------------------------
    // Do Setup

    useEffect(() => {
        getData().then();
    }, []);


    async function getData() {
        const supabase = createClient('https://heinegxlzmatuyvslqnz.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhlaW5lZ3hsem1hdHV5dnNscW56Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk3MDAzNzQsImV4cCI6MjA1NTI3NjM3NH0.Z0IATzKModUJ1GjYlsRGAx6Y7k3QjmvHXJdM8HnhKGg');

        const { data, error } = await supabase
            .from('benchmark')
            .select('id, model, cpu, platform, time, hardwareConcurrency');
        console.log("loaded", { data, error });
        setTabs(data);
    }



    return (
        <GradientBG>
            <div className={styles.main} style={{ padding: 0, width: "100%" }}>
                <div className={styles.center} style={{ padding: "10px", width: "100%" }}>
                    <table style={{ width: "100%" }}>
                        <thead>
                            <tr>
                                <th>Model</th>
                                <th>Cpu</th>
                                <th>Platorm</th>
                                <th>Threads</th>
                                <th>time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tabs.map((x) => <tr key={x.id}>
                                <td>{x.model}</td>
                                <td>{x.cpu}</td>
                                <td>{x.platform}</td>
                                <td>{x.hardwareConcurrency}</td>
                                <td>{x.time / 1000} s</td>
                            </tr>)}
                        </tbody>
                    </table>
                </div>
            </div>
        </GradientBG >
    );
}