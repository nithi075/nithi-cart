import {useState} from 'react';
import {useNavigate} from 'react-router-dom';

export default function Search() {
    const [keyword, setKeyword]  = useState("");

    const navigate = useNavigate();

    const searchHandler = () => {
        navigate('/search?keyword='+keyword)
    }

    return<div className="input-group">
    <label htmlFor="search_field" className="visually-hidden">Search</label>
    <input
        type="text"
        id="search_field"
        onChange={(e) => setKeyword(e.target.value)}
        className="form-control"
        onKeyDown={(e) => {
            if (e.key === 'Enter') {
                searchHandler();
            }
        }}
        placeholder="Enter Product Name ..."
    />
    {/* ... rest of the component ... */}
</div>}