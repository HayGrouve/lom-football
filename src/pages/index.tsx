import { type NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";
import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "../styles/index.module.css";

interface dbPlayers {
  id: number;
  created_at: string;
  name: string;
}

const Home: NextPage = () => {
  const [localPlayers, setPlayers] = useState<dbPlayers[]>([]);
  const [playerName, setPlayerName] = useState("");
  const [isRefresh, setIsRefresh] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [teamA, setTeamA] = useState<dbPlayers[]>([]);
  const [teamB, setTeamB] = useState<dbPlayers[]>([]);
  const [dateTime, setDateTime] = useState<{
    day: string;
    start: number;
    end: number;
  }>();
  const [day, setDay] = useState("");
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);

  const getRandomTeams = () => {
    const playersToSort = localPlayers.map((item) => item);
    const players = playersToSort.sort((a, b) => 0.5 - Math.random());
    const indexToSplit = players.length / 2;
    setTeamA(players.slice(0, indexToSplit));
    setTeamB(players.slice(indexToSplit));
  };

  const addPlayer = async () => {
    if (playerName.trim().length === 0) {
      toast.error("Невалидно име!");
      setPlayerName("");
      return;
    }
    if (localPlayers.length === 14) {
      toast.error("Много ора сме уе!");
      setPlayerName("");
      return;
    }
    const { error } = await supabase
      .from("players")
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      .insert({ id: uuidv4(), name: playerName });
    if (error) console.log("error", error);
    toast.success(`${playerName} е регистриран!`);
    setPlayerName("");
    setIsRefresh(!isRefresh);
  };

  const removePlayer = async (playerID: number) => {
    const { error } = await supabase
      .from("players")
      .delete()
      .eq("id", playerID);
    if (error) console.log("error", error);
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
    // eslint-disable-next-line
    if (dateTimeItem) setDateTime(dateTimeItem[dateTimeItem?.length - 1]);
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
      .insert({ id: uuidv4(), day: day, start: startTime, end: endTime });
    if (error) console.log("error", error);
    toast.success(`Дата и час са променени!`);
    setDay("");
    setStartTime(NaN);
    setEndTime(NaN);
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
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#000000] to-[#555555]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <ToastContainer />;
          <h1 className="text-center text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            <span onClick={() => setIsAdmin(!isAdmin)}>L</span>omski{" "}
            <span className={"text-green-600"}>FOOTBALL</span>
          </h1>
          <h2 className="text-center text-3xl tracking-tight text-white">
            {dateTime && dateTime.day} от {dateTime && dateTime.start}:
            {dateTime && dateTime.end === 0
              ? `${dateTime.end}0`
              : dateTime && dateTime.end}
            ч.
          </h2>
          {isAdmin && (
            <div className="flex flex-col gap-2 text-white sm:flex-row">
              <input
                onKeyUp={(e) => {
                  if (e.key === "Enter") {
                    void addPlayer();
                  }
                }}
                onChange={(e) => void setDay(e.target.value)}
                value={day}
                type="text"
                id="first_name"
                className={
                  "rounded border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                }
                placeholder="Ден"
                required
              />
              <input
                onChange={(e) => setStartTime(parseInt(e.target.value))}
                value={startTime}
                type="number"
                id="first_name"
                max={24}
                className={
                  "rounded border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                }
                placeholder="Час"
                required
              />
              <input
                onChange={(e) => setEndTime(parseInt(e.target.value))}
                value={endTime}
                type="number"
                max={24}
                id="first_name"
                className={
                  "rounded border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                }
                placeholder="Минути"
                required
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
          <iframe
            className={styles.map}
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1467.2546323433069!2d23.353366104190346!3d42.65056237050475!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xa975548429c8bc0f!2s%22Bonsist%22%20Sports%20Complex!5e0!3m2!1sen!2sbg!4v1675163061462!5m2!1sen!2sbg"
            width="100%"
            loading="lazy"
          ></iframe>
          <p className="text-xs text-white">
            Администратор{" "}
            <a
              href="https://www.facebook.com/dobrevv"
              className="font-medium text-blue-600 hover:underline dark:text-blue-500"
            >
              Дани
            </a>
          </p>
          <div className={styles.container}>
            <label htmlFor="player">Zapishi se:</label>
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
              placeholder="Patriciq"
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
            <table className="text-md w-full text-left text-gray-200 dark:text-gray-300">
              <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    #
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Name
                  </th>
                </tr>
              </thead>
              <tbody>
                {localPlayers.map((item, index) => (
                  <tr
                    key={item.id}
                    className="border-b bg-white text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                  >
                    <td className="px-6 py-4">{index + 1}</td>
                    <td className="px-6 py-4">
                      {item.name}
                      {isAdmin && (
                        <button
                          onClick={() => void removePlayer(item.id)}
                          className={
                            "ml-3 cursor-pointer text-red-500 hover:text-red-400"
                          }
                        >
                          {" "}
                          X
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <hr className="my-8 h-px w-4/5 border-0 bg-gray-200 dark:bg-gray-700" />
          <div className="flex flex-col gap-7">
            <h2 className="text-center text-3xl font-bold text-white">
              Кинти на човек:{" "}
              <span className="text-green-600">
                {(90 / localPlayers.length).toFixed(2)}
              </span>{" "}
              лв.
            </h2>
            <div className="mt-6 flex justify-center gap-5">
              <div>
                <h3 className=" text-xl font-bold text-white">
                  Отбор Инвалидите
                </h3>
                <ul className="max-w-md list-inside list-disc space-y-1 text-gray-300">
                  {teamA.map((item) => (
                    <li key={item.id}>{item.name}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className=" text-xl font-bold text-white">
                  Отбор БУКЛУК БЕ
                </h3>
                <ul className="max-w-md list-inside list-disc space-y-1 text-gray-300">
                  {teamB.map((item) => (
                    <li key={item.id}>{item.name}</li>
                  ))}
                </ul>
              </div>
            </div>
            <button
              onClick={getRandomTeams}
              type="submit"
              className="cursor-pointer rounded bg-green-800 px-5
      py-2.5 text-sm font-medium uppercase text-white transition duration-150 hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 dark:bg-green-700 dark:hover:bg-green-600 dark:focus:ring-green-800"
            >
              Избери отбори
            </button>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
