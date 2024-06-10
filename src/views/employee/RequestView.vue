<template>
  <div
    class="w-full flex max-lg:flex-col items-center justify-center text-surface-700 py-12 md:px-12"
  >
    <div
      class="flex flex-col w-full min-w-min border-2 h-full rounded-lg mx-auto bg-white shadow-xl relative"
    >
      <div class="absolute top-0 left-0">
        <Button icon="pi pi-arrow-left" rounded text @click="router.back()" />
      </div>
      <div class="w-full p-10">
        <div class="space-y-5 flex flex-col">
          <div class="text-2xl font-semibold">Requests</div>
          <div>
            <DialogUpdateRequest @fetchData="fetchData" :request="request" />
          </div>
          <div class="flex max-lg:flex-col gap-5">
            <div class="space-y-5 lg:w-1/2 flex flex-col">
              <div class="flex flex-col max-sm:w-full">
                <div class="text-base font-semibold text-surface-700">
                  Status:
                </div>
                <div
                  class="text-sm font-normal text-surface-800 overflow-hidden text-ellipsis whitespace-nowrap"
                >
                  <Tag
                    :severity="getSeverity(request.status)"
                    :value="request.status"
                  ></Tag>
                </div>
              </div>
              <div class="flex flex-col max-sm:w-full">
                <div class="text-base font-semibold text-surface-700">
                  Reason:
                </div>
                <div
                  class="text-sm font-normal text-surface-800 overflow-hidden text-ellipsis whitespace-nowrap"
                >
                  {{ request.reason }}
                </div>
              </div>
              <div class="flex flex-col max-sm:w-full">
                <div class="text-base font-semibold text-surface-700">
                  Init Date
                </div>
                <div
                  class="text-sm font-normal text-surface-800 overflow-hidden text-ellipsis whitespace-nowrap"
                >
                  {{
                    request.initDate
                      ? format(request.initDate, "DD/MM/YYYY", "en")
                      : "N/A"
                  }}
                </div>
              </div>
              <div class="flex flex-col max-sm:w-full">
                <div class="text-base font-semibold text-surface-700">
                  End Date
                </div>
                <div
                  class="text-sm font-normal text-surface-800 overflow-hidden text-ellipsis whitespace-nowrap"
                >
                  {{
                    request.endDate
                      ? format(request.endDate, "DD/MM/YYYY", "en")
                      : "N/A"
                  }}
                </div>
              </div>
              <div class="flex flex-col max-sm:w-full">
                <div class="text-base font-semibold text-surface-700">
                  Document:
                </div>
                <div
                  class="overflow-hidden text-ellipsis whitespace-nowrap text-primary-500"
                >
                  <a
                    :href="request.document?.url"
                    target="_blank"
                    class="text-sm font-normal"
                  >
                    <span v-if="request.document" class="pi pi-file-pdf"></span>
                    {{ request.document?.name }}
                  </a>
                </div>
              </div>
              <div class="flex flex-col max-sm:w-full">
                <div class="text-base font-semibold text-surface-700">
                  Description:
                </div>
                <div
                  class="text-sm font-normal text-surface-800 w-full lg:w-3/4"
                >
                  {{ request.description ? request.description : "N/A" }}
                </div>
              </div>
              <div class="flex flex-col max-sm:w-full">
                <div class="text-base font-semibold text-surface-700">
                  Created At:
                </div>
                <div
                  class="text-sm font-normal text-surface-800 overflow-hidden text-ellipsis whitespace-nowrap"
                >
                  {{
                    request.createdAt
                      ? format(request.createdAt, "DD/MM/YYYY", "en")
                      : "N/A"
                  }}
                </div>
              </div>

              <div
                v-if="request.status !== 'Pending'"
                class="flex flex-col max-sm:w-full"
              >
                <div class="text-base font-semibold text-surface-700">
                  Approved By:
                </div>
                <div
                  class="text-sm font-normal text-surface-800 overflow-hidden text-ellipsis whitespace-nowrap"
                >
                  {{
                    request.approvedBy
                      ? request.approvedBy.firstName +
                        " " +
                        request.approvedBy.lastName
                      : "N/A"
                  }}
                </div>
              </div>
              <div
                v-if="request.status !== 'Pending'"
                class="flex flex-col max-sm:w-full"
              >
                <div class="text-base font-semibold text-surface-700">
                  Approved At:
                </div>
                <div
                  class="text-sm font-normal text-surface-800 overflow-hidden text-ellipsis whitespace-nowrap"
                >
                  {{
                    request.approvedAt
                      ? format(request.approvedAt, "DD/MM/YYYY", "en")
                      : "N/A"
                  }}
                </div>
              </div>
            </div>
            <div class="w-full lg:w-1/2">
              <div class="flex flex-col">
                <div>
                  <div class="text-base font-semibold text-surface-700">
                    Calendar:
                  </div>
                  <div class="">
                    <VCalendar
                      :attributes="attributes"
                      ref="calendar"
                      expanded
                      :rows="2"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useRequestStore } from "@/stores/request";
import { format } from "@formkit/tempo";
import DialogUpdateRequest from "@/components/employee/DialogUpdateRequest.vue";

const router = useRouter();
const requestStore = useRequestStore();
const id = ref(router.currentRoute.value.params.id);
const request = ref({});
const attributes = ref([]);
const calendar = ref(null);

onMounted(async () => {
  fetchData();
});
const fetchData = async () => {
  await requestStore.getRequestById(id.value);
  request.value = requestStore.request;
  attributes.value = [
    {
      highlight:
        request.value.status === "Approved"
          ? "green"
          : request.value.status === "Rejected"
          ? "red"
          : "orange",
      popover: {
        label: request.value.reason,
      },
      dates: {
        start: addDay(request.value.initDate),
        end: addDay(request.value.endDate),
      },
    },
  ];
  await calendar.value.move(request.value.initDate);
};
const getSeverity = (status) => {
  switch (status) {
    case "Pending":
      return "warning";

    case "Approved":
      return "success";

    case "Rejected":
      return "danger";
  }
};
const addDay = (date) => {
  let res = new Date(date);
  res.setDate(res.getDate() + 1);
  return res;
};
</script>
