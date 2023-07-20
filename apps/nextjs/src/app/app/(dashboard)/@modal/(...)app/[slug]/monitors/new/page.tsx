import { InterceptingModal } from "~/components/intercepting-modal";
import { ModalNewMonitor } from "~/components/modal/new-monitor";

export default function NewMonitorModal() {
  return (
    <InterceptingModal>
      <ModalNewMonitor />
    </InterceptingModal>
  );
}
