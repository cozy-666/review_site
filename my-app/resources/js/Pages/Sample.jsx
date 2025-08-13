import { useEffect } from 'react';

const Sample = () => {
    useEffect(() => {
        console.log('component mounted');
        return () => {
            console.log('Component unmounted')
        };
    },[]);

    return <div>これはサンプルです</div>
}

export default Sample;
