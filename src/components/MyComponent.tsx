import React, { FC } from 'react';
import useFetch from '../hooks/useDataFetcher';

const MyComponent: FC = () => {
    const [state, fetchData] = useFetch<any>('https://httpbin.org/get');

    return (
        <div>
            {state.loading && <p>Loading...</p>}
            {state.error && <p>Error: {state.error}</p>}
            {state.data && <pre>Data: {JSON.stringify(state.data, null, 2)}</pre>}
            <button onClick={fetchData}>Refetch</button>
        </div>
    );
};

export default MyComponent;
