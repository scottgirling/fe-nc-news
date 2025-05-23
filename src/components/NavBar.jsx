import { Link } from 'react-router-dom';
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
            {isLoading ? (
                <p>Topics loading...</p> 
            ) : (
                <section className="topic-list">
                    {topics.map((topic) => {
                        return (
                            <Link 
                                to={`/search/${topic.slug}?p=1`} 
                                className="nav-topic" 
                                key={topic.slug}
                            >
                                {topic.slug[0].toUpperCase() + topic.slug.slice(1)}
                            </Link>
                        )
                    })}
                </section>
            )}
        </nav>
    )
}