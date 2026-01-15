"use client"


import { Tabs } from "@mantine/core";
import { IconMessageCircle, IconPhoto, IconSettings } from "@tabler/icons-react";

export default function Page() {
  return (
    <div className="flex flex-col gap-4 p-4 bg-zinc-200 h-full min-h-0">
      <div className="bg-red-200 h-30">
        要素①
      </div>
      <Tabs 
        defaultValue="gallery" 
        className="flex-1 min-h-0"
        styles={{
          root: { display: "flex", flexDirection: "column", height: "100%" },
          panel: { flex: 1, minHeight: 0, overflow: "auto" },
        }}
      >
        <Tabs.List>
          <Tabs.Tab value="gallery" leftSection={<IconPhoto size={12} />}>
            Gallery
          </Tabs.Tab>
          <Tabs.Tab value="messages" leftSection={<IconMessageCircle size={12} />}>
            Messages
          </Tabs.Tab>
          <Tabs.Tab value="settings" leftSection={<IconSettings size={12} />}>
            Settings
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="gallery">
          Gallery tab content1<br/>
          Gallery tab content2<br/>
          Gallery tab content3<br/>
          Gallery tab content4<br/>
          Gallery tab content5<br/>
          Gallery tab content6<br/>
          Gallery tab content7<br/>
          Gallery tab content8<br/>
          Gallery tab content9<br/>
          Gallery tab content10<br/>
          Gallery tab content11<br/>
          Gallery tab content12<br/>
          Gallery tab content13<br/>
          Gallery tab content14<br/>
          Gallery tab content15<br/>
        </Tabs.Panel>

        <Tabs.Panel value="messages">
          Messages tab content
        </Tabs.Panel>

        <Tabs.Panel value="settings">
          Settings tab content
        </Tabs.Panel>
      </Tabs>
      <div className="bg-red-200 h-100">
        要素③
      </div>
      
    </div>
  )
}
