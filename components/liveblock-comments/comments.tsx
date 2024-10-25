import { ClientSideSuspense } from '@liveblocks/react'
import React from 'react'
import { CommentsOverlay } from './comments-overlay'

export const Comments = () => {
  return (
<ClientSideSuspense fallback={null}>
{()=><CommentsOverlay/>}
</ClientSideSuspense>
  )
}
