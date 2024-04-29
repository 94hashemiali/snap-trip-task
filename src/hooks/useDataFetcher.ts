import { useState } from 'react';
import axios, {AxiosRequestConfig, CancelTokenSource} from 'axios';

type FetchState<T> = {
    data: T | null;
    loading: boolean;
    error: string | null;
    cancelTokenSource: CancelTokenSource | null;
};

type UseFetchReturn<T> = [FetchState<T>, () => void];

const useFetch = <T>(url: string): UseFetchReturn<T> => {
    const [state, setState] = useState<FetchState<T>>({
        data: null,
        loading: false,
        error: null,
        cancelTokenSource: null,
    });


    const fetchData = async () => {
        setState((prevState) => ({ ...prevState, loading: true }));

        if (state.cancelTokenSource) {
            state.cancelTokenSource.cancel('Previous request cancelled');
        }

        state.cancelTokenSource = axios.CancelToken.source();

        const config: AxiosRequestConfig = {
            cancelToken: state.cancelTokenSource.token,
            headers: {
                'Accept': 'application/json',
            }
        };

        try {
            const response = await axios.get<T>(url, config);
            setState({ data: response.data, loading: false, error: null, cancelTokenSource: null });
        } catch (error: any) {
            if (!axios.isCancel(error)) {
                setState({
                    data: null,
                    loading: false,
                    error: error.message,
                    cancelTokenSource: null,
                });
            }
        }
    };

    return [state, fetchData];
};

export default useFetch;
