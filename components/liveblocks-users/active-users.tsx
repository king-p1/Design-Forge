import { generateRandomName } from "@/lib/utils";
import { Avatar } from "./avatar";
import styles from "./index.module.css";
import { useOthers, useSelf } from "@/liveblocks.config";
import { useMemo } from "react";

export const ActiveUsers =()=> {
  const users = useOthers();
  const currentUser = useSelf();
  const hasMoreUsers = users.length > 3;


  const memoiizedUsers = useMemo(()=>{
    return (
        <div className="flex  justify-center gap-1 items-center py-2">
        <div className="flex pl-3">
  
        {currentUser && (
               <Avatar otherStyles='border-2 border-primary-green' name="You" />
           )}
  
          {users.slice(0, 3).map(({ connectionId, info }) => {
            return (
              <Avatar key={connectionId} name={generateRandomName()} otherStyles='-ml-3' />
            );
          })}
  
          {hasMoreUsers && <div className={styles.more}>+{users.length - 3}</div>}
  
        
        </div>
      </div>
    )
  },[users.length])
  
  return memoiizedUsers
}