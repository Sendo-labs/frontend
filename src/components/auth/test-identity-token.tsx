'use client';

import { useIdentityToken } from '@privy-io/react-auth';
import { useEffect } from 'react';

export function TestIdentityToken() {
    const { identityToken } = useIdentityToken();

    useEffect(() => {
        if (identityToken) {
            console.log('✅ Identity token trouvé!', identityToken.substring(0, 50) + '...');
        } else {
            console.log('❌ Pas de token');
        }
    }, [identityToken]);

    return (
        <div className="p-4 rounded">
            <h3 className="font-bold">Debug Identity Token</h3>
            <p>Token présent: {identityToken ? '✅ OUI' : '❌ NON'}</p>
            {identityToken && (
                <pre className="text-xs mt-2 overflow-auto max-w-full">
                    {identityToken.substring(0, 100)}...
                </pre>
            )}
        </div>
    );
}