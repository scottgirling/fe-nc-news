import '../Loading.css'

export const Loading = () => {
    return (
        <div>
            <i className="fa-regular fa-newspaper"></i>
            <p className="top-loading">News flash: You're awesome!</p>
            <p className="bottom-loading">Searching for your next read...</p>
        </div>
    );
}