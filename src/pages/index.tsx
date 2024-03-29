import { type NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";
import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "../styles/index.module.css";
import { formatMinutes, formatDayName } from "../util/dateHelper";
import { TableDemo } from "../components/table.component";
import { Checkbox } from "../../@/components/ui/checkbox";

export interface dbPlayers {
  id: number;
  created_at: string;
  name: string;
}

const Home: NextPage = () => {
  const [localPlayers, setPlayers] = useState<dbPlayers[]>([]);
  const [playerName, setPlayerName] = useState("");
  const [isRefresh, setIsRefresh] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [dateTime, setDateTime] = useState<Date>();

  const addPlayer = async () => {
    if (playerName.trim().length === 0) {
      toast.error("Невалидно име!");
      setPlayerName("");
      return;
    }
    if (localPlayers.length === 12) {
      toast.error("Много ора сме уе!");
      setPlayerName("");
      return;
    }
    const { data } = await supabase
      .from("players")
      .select()
      .filter("name", "in", `(${playerName})`);
    if (data && data?.length === 0) {
      const { error } = await supabase
        .from("players")
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
        .insert({ name: playerName });
      if (error) console.log("error", error);
      toast.success(`${playerName} е регистриран!`);
      setPlayerName("");
      setIsRefresh(!isRefresh);
    } else {
      toast.error(`${playerName} вече е регистриран!`);
      setPlayerName("");
      setIsRefresh(!isRefresh);
    }
  };

  const removePlayer = async (playerID: number) => {
    const { error } = await supabase
      .from("players")
      .delete()
      .eq("id", playerID);
    if (error) {
      console.log("error", error);
      toast.error(`Грешка при изтриване на играча!`);
    } else toast.success(`Играчът е изтрит!`);
    setIsRefresh(!isRefresh);
  };

  const getPlayers = async () => {
    const { data: names, error } = await supabase
      .from("players")
      .select("*")
      .order("id");
    if (error) console.log("error", error);
    else setPlayers(names);
    const { data: dateTimeItem } = await supabase.from("datetime").select("*");
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    if (dateTimeItem) setDateTime(new Date(dateTimeItem[0].datetime));
  };

  const deleteAllPlayers = () => {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    localPlayers.forEach(async (player) => {
      const { error } = await supabase
        .from("players")
        .delete()
        .eq("id", player.id);
      if (error) console.log("error", error);
      setIsRefresh(!isRefresh);
    });
  };

  const changeDateTime = async () => {
    const { error } = await supabase
      .from("datetime")
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      .update({ datetime: dateTime?.toISOString() })
      .eq("id", "c9fa4afb-607b-4bf3-b377-cc3b0253fe8f");
    if (error) console.log("error", error);
    toast.success(`Дата и час са променени!`);
    setIsRefresh(!isRefresh);
  };

  useEffect(() => {
    void getPlayers();
  }, [isRefresh]);

  return (
    <>
      <Head>
        <title>Football Lom</title>
        <meta
          name="This site is about people playing football"
          content="Made by Tsvetomir Tsekov"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#000000] to-[#555555] py-10 ">
        <div className="container flex flex-col items-center justify-center gap-12 pb-10">
          <h1 className="text-center text-4xl font-extrabold tracking-tight text-white sm:text-[4rem]">
            <span onClick={() => setIsAdmin(!isAdmin)}>L</span>omski{" "}
            <span className={"text-green-600"}>FOOTBALL</span>
          </h1>
          <h2 className="text-center text-3xl tracking-tight text-white">
            {dateTime && formatDayName(dateTime.getDay())} от{" "}
            {dateTime && dateTime.getHours()}:
            {dateTime && formatMinutes(dateTime.getMinutes())}
            ч.
          </h2>
          {isAdmin && (
            <div className="flex flex-col gap-2 text-white sm:flex-row">
              <input
                type="datetime-local"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                placeholder="Select date"
                onChange={(e) => setDateTime(new Date(e.target.value))}
              />
              <button
                onClick={() => void changeDateTime()}
                type="submit"
                className="cursor-pointer rounded bg-green-800
      px-5 py-2.5 text-sm font-medium uppercase text-white transition duration-150 hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 dark:bg-green-700 dark:hover:bg-green-600 dark:focus:ring-green-800"
              >
                Ok
              </button>
            </div>
          )}

          <div className={styles.container}>
            <input
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  void addPlayer();
                }
              }}
              onChange={(e) => setPlayerName(e.target.value)}
              value={playerName}
              type="text"
              id="first_name"
              className={
                "rounded border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              }
              placeholder="Позови се"
              required
            />
            <button
              onClick={() => void addPlayer()}
              type="submit"
              className="cursor-pointer rounded bg-green-800
      px-5 py-2.5 text-sm font-medium uppercase text-white transition duration-150 hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 dark:bg-green-700 dark:hover:bg-green-600 dark:focus:ring-green-800"
            >
              Ok
            </button>

            {isAdmin && (
              <button
                onClick={() => void deleteAllPlayers()}
                type="submit"
                className="cursor-pointer rounded bg-red-700
            px-5 py-2.5 text-sm font-medium uppercase text-white transition duration-150 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
              >
                X
              </button>
            )}
          </div>
          <div className="relative overflow-x-auto">
            <TableDemo
              players={localPlayers}
              isAdmin={isAdmin}
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              removePlayer={removePlayer}
            />
          </div>
          <iframe
            className={styles.map}
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1037.878130457953!2d23.357302921924592!3d42.62823046503449!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40aa86b3edcad75b%3A0x2841fed3240fdfc5!2sFootball%20Malinova%20Dolina%20Sport!5e0!3m2!1sen!2sbg!4v1705941573219!5m2!1sen!2sbg"
            width="100%"
            loading="lazy"
          ></iframe>
        </div>

        <ToastContainer />
      </main>
    </>
  );
};

export default Home;
