import { useMyAppointments } from "../../../hooks/useApi";
import Sidebar from "../../../components/layout/Sidebar";
import Navbar from "../../../components/layout/Navbar";
import MobileNav from "../../../components/layout/MobileNav";
import Card from "../../../components/ui/Card";
import Skeleton from "../../../components/ui/Skeleton";
import { formatDate, formatTime } from "../../../utils/formatDate";

const Dashboard = () => {
  const { data: appointments, isLoading } = useMyAppointments();

  return (
    <div className="flex min-h-screen bg-zinc-950 text-white">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <div className="p-6 pb-20 md:pb-6">
          <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

          {/* Próximo agendamento */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Próximo Agendamento</h2>
            {isLoading ? (
              <Skeleton className="h-24" />
            ) : appointments && appointments.data.length > 0 ? (
              <Card>
                <p>Serviço: Corte de Cabelo</p>
                <p>Data: {formatDate('2024-10-01')} às {formatTime('14:00')}</p>
                <p>Funcionário: João Silva</p>
              </Card>
            ) : (
              <Card>
                <p className="text-zinc-400">Nenhum agendamento encontrado</p>
              </Card>
            )}
          </div>

          {/* Lista de agendamentos */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Meus Agendamentos</h2>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-16" />
                <Skeleton className="h-16" />
              </div>
            ) : appointments && appointments.data.length > 0 ? (
              <div className="space-y-4">
                {appointments.data.map((appt) => (
                  <Card key={appt.id}>
                    <p>Serviço: {appt.servico}</p>
                    <p>Data: {formatDate(appt.data_hora)} às {formatTime(appt.data_hora)}</p>
                    <p>Funcionário: {appt.funcionario}</p>
                    <p>Status: {appt.status}</p>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <p className="text-zinc-400">Nenhum agendamento encontrado</p>
              </Card>
            )}
          </div>
        </div>
        <MobileNav />
      </div>
    </div>
  );
};

export default Dashboard;