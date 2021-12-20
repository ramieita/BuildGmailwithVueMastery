<template>
  <button @click="selectedScreen = 'inbox'"
          :disabled="selectedScreen == 'inbox'"
  > INbox
  </button>
  <button @click="selectedScreen = 'Archived'"
          :disabled="selectedScreen == 'Archived'"
  > Archived
  </button>

  <h1>{{ emailSelection.emails.size }} emails selected</h1>
  <table class=" mail-table
  ">
    <tbody>
    <tr v-for="email in unarchivedEmail" :key="email.id"
        :class="['clickable' , email.read ? 'read' : '' ]"
    >
      <td>
        <input type="checkbox"
               @click="emailSelection.toggle(email)"
               :selected="emailSelection.emails.has(email)"/>
      </td>
      <td @click="openMail(email)"> {{ email.from }}</td>
      <td @click="openMail(email)"><p><strong> {{ email.subject }} </strong></p></td>
      <td @click="openMail(email)" class="date"> {{
          format(new Date(email.sentAt), 'MMM do yyyy')
        }}
      </td>
      <td>
        <button @click="archiveEmail(email)"> Archive</button>
      </td>
    </tr>
    </tbody>
  </table>
  <ModalView v-if="openedEmail" @closeModal="openedEmail= null">
    <MailView :email="openedEmail" @changeEmail="changeEmail"/>
  </ModalView>
</template>

<script>
import {format} from "date-fns";
import axios from 'axios'
import MailView from "./MailView";
import ModalView from "./ModalView";
import {ref} from 'vue';
import useEmailSelection from '@/composables/use-email-selection'

export default {
  name: "MailTable",
  components: {MailView, ModalView},
  async setup() {
    let openedEmail = null
    let reposne = await axios.get(`http://localhost:3000/emails`)
    let emails = reposne.data

    return {
      openedEmail,
      format,
      emails,
      emailSelection: useEmailSelection(),
      selectedScreen: ref('inbox')
    }
  },
  // maybe update to vue j3
  computed: {
    sortEmails() {
      return this.emails.sort((el1, el2) => {
        return el1.sentAt < el2.sentAt ? 1 : -1
      })
    },
    unarchivedEmail() {
      if (this.selectedScreen == 'inbox') {
        return this.sortEmails.filter(e => !e.archived)
      } else {
        return this.sortEmails.filter(e => e.archived)
      }
    }
  },
  methods: {
    openMail(email) {
      this.openedEmail = email
      if (email) {
        email.read = true
        this.updateEmail(email)
      }
    },
    archiveEmail(email) {
      email.archived = true
      this.updateEmail(email)
    },

    changeEmail({toggleRead, toggleArchive, save, closeModal, changeIndex}) {
      let email = this.openedEmail
      if (toggleRead) {
        email.read = !email.read
      }
      if (toggleArchive) {
        email.archived = !email.archived
      }
      if (save) {
        this.updateEmail(email)
      }
      if (closeModal) {
        this.openedEmail = null
      }
      if (changeIndex) {
        let emails = this.unarchivedEmail
        let currentIndex = emails.indexOf(this.openedEmail)
        let newEmail = emails[currentIndex + changeIndex]
        this.openMail(newEmail)
      }
    },
    updateEmail(email) {
      axios.put(`http://localhost:3000/emails/${email.id}`, email)
    }
  }


}
</script>

<style scoped>

</style>
