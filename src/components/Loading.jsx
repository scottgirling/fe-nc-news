import '../Loading.css'

export const Loading = () => {
    return (
        <section className="loading-message">
            <i className="fa-regular fa-newspaper"></i>
            <h1 className="top-loading">News flash: You're awesome!</h1>
            <p className="bottom-loading">Searching for your next read...</p>
        </section>
    )
}