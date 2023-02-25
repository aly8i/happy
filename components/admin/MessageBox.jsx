import React from 'react'
import styles from "../../styles/MessageBox.module.scss"
import SendIcon from '@mui/icons-material/Send';
import { useState, useEffect, useRef } from 'react';
import { useSelector } from "react-redux";
import axios from 'axios';
import Progress from '../Progress';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
const MessageBox = () => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [chats, setChats] = useState([]);
    const [count, setCount] = useState(0);
    const [count2, setCount2] = useState(0);
    const [selectedChat, setSelectedChat] = useState("");
    const timerRef = useRef();
    const timerRef2 = useRef();
    const user = useSelector((state) => state.user);
    const [loaded, setLoaded] = useState(false);
    const lastDiv = useRef(null);
    const firstDiv = useRef(null);
    const [isUsersHovered, setIsUsersHovered] = useState(false);
    const [showChats, setShowChats] = useState(false);

    const getDate = () => {
        const date = new Date;
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const formattedDate = `${month}/${day}/${year}`;
        return formattedDate;
    }

    const getTime = () => {
        const date = new Date;
        let hours = date.getHours();
        const minutes = date.getMinutes();

        let timeSuffix = "am";
        if (hours >= 12) {
            timeSuffix = "pm";
            hours -= 12;
        }
        if (hours === 0) {
            hours = 12;
        }
        const formattedTime = `${hours}:${minutes < 10 ? "0" + minutes : minutes} ${timeSuffix}`;
        return formattedTime;
    }

    const sendMessage = async (e) => {
        e.preventDefault();
        if (message == "") return;
        try {
            const res = axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/api/chat/${selectedChat}`, { status: "recieved", message, time: getTime(), date: getDate() });
        } catch (err) {
            console.log("failed to send");
        }
        setMessage('');
    }
    useEffect(() => {
        if (messages.length == 0 && loaded)
            return;
        lastDiv.current?.parentElement?.scrollTo({
            top: lastDiv.current?.offsetTop,
            left: 0,
            behavior: 'smooth'
        });
        setLoaded(true);
    }, [messages, loaded])
    useEffect(() => {
        let timeout
        if (count2 == 0)
            timeout = 100
        else
            timeout = 60000
        timerRef2.current = setTimeout(async () => {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/chat`);
            await (async () => {
                const temp = await sortChats(res.data)
                setChats(temp);
                if (count2 == 0) {
                    setSelectedChat(temp[0].userID._id)
                }
            })().then(() => {
                if (isUsersHovered) return;
                if (firstDiv.current) {
                    firstDiv.current.scrollTo({ top: 0, behavior: 'smooth' });
                }

            });
            setCount2(count2 => count2 + 1);
        }, timeout);

        return () => clearTimeout(timerRef2.current);
    }, [count2]);

    useEffect(() => {
        timerRef.current = setTimeout(async () => {

            if (selectedChat != "") {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/chat/${selectedChat}`);
                if (messages.length != res.data.messages.length) {
                    await (async () => {
                        setMessages(res.data.messages);
                    })().then(() => {
                        lastDiv.current?.parentElement?.scrollTo({
                            top: lastDiv.current?.offsetTop,
                            left: 0,
                            behavior: 'smooth'
                        });
                    });
                }
            }
            setCount(count => count + 1);
        }, 1000);

        return () => clearTimeout(timerRef.current);
    }, [count]);
    function handleEnter(e) {
        if (e.key === 'Enter' && document.activeElement === e.target) {
            sendMessage(e);
        }
    }
    const sortChats = async (arr) => {
        const temp1 = await arr.filter((a) => a.messages.length > 0);
        const temp2 = await temp1.sort((a, b) => {
            const aDate = new Date(`${a.messages[a.messages.length - 1].date} ${a.messages[a.messages.length - 1].time}`);
            const bDate = new Date(`${b.messages[b.messages.length - 1].date} ${b.messages[b.messages.length - 1].time}`);
            if (aDate > bDate) {
                return -1;
            }
            else if (aDate < bDate) {
                return 1;
            }
            return 0;
        })
        return temp2;

    };

    return (
        <div className={styles.container}>
            <div className={`${styles.usersContainer} ${showChats && styles.show}`} ref={firstDiv} onMouseEnter={() => setIsUsersHovered(true)} onMouseLeave={() => setIsUsersHovered(false)}>
                {
                    chats.map((chat, i) => {
                        if (chat.messages.length > 0)
                            return (
                                <div key={i} className={`${styles.user} ${selectedChat == chat.userID._id && styles.selectedUser}`} onClick={() => setSelectedChat(chat.userID._id)}>
                                    {chat.userID.username}
                                    {chat.messages[chat.messages.length - 1].status == "sent" && <div className={styles.unReplied} />}
                                </div>
                            )
                    })
                }
            </div>
            <div className={styles.chatContainer}>
                <div className={styles.messages}>
                    {
                        count == 0 || messages.length == 0 ?
                            <div className={styles.progressContainer}>
                                <Progress />
                            </div> :
                            <>
                                {
                                    messages.map((message, i) => {

                                        if (message.status == "sent") {
                                            return (
                                                <div key={i} className={styles.sent} >
                                                    {message.message.includes("http://")||message.message.includes("https://")?<a href={message.message} target="_blank" rel="noreferrer"  className={styles.message}><b>{message.message}</b></a>:<div className={styles.message}>{message.message}</div>}
                                                    <div className={styles.time}>{message.time}</div>
                                                    <div className={styles.sentAnchor} />
                                                </div>
                                            )
                                        } else {
                                            return (
                                                <div key={i} className={styles.recieved} >
                                                     {message.message.includes("http://")||message.message.includes("https://")?<a href={message.message} target="_blank" rel="noreferrer"  className={styles.message}><b>{message.message}</b></a>:<div className={styles.message}>{message.message}</div>}
                                                    <div className={styles.time}>{message.time}</div>
                                                    <div className={styles.recievedAnchor} />
                                                </div>
                                            )
                                        }
                                    })
                                }
                            </>
                    }
                    <div className={styles.last} ref={lastDiv} />
                </div>
                <div className={styles.inputContainer}>
                    <div className={styles.openChats} onClick={() => { showChats ? setShowChats(false) : setShowChats(true) }}>
                        <QuestionAnswerIcon className={styles.openChatsIcon} />
                    </div>
                    <input type="text" onKeyDown={handleEnter} value={message} onChange={(e) => setMessage(e.target.value)} name="message" className={styles.input} />
                    <div className={styles.send} onClick={(e) => { sendMessage(e) }}>
                        <SendIcon className={styles.sendIcon} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MessageBox