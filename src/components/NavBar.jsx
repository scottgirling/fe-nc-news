import { useEffect, useState } from 'react';
import { fetchTopics } from '../utils/api';
import '../NavBar.css'

export const NavBar = () => {
    const [topics, setTopics] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        fetchTopics()
        .then((returnedTopics) => {
            setTopics(returnedTopics);
            setIsLoading(false);
        });
    }, []);

    return (
        <nav>
            <p className="bold">Search by topic:</p>
            {isLoading ? <p>Topics loading...</p> 
            :
            <>
                {topics.map((topic) => {
                    return (
                        <li className="nav-topic" key={topic.slug}>
                                {topic.slug[0].toUpperCase() + topic.slug.slice(1)}
                            </li>
                        );
                    })
                }
            </>
            }
        </nav>
    );
}