<template>
  <private-view title="Wedding Vendor Dashboard">
    <template #headline>
      <v-breadcrumb :items="[{ name: 'Wedding Vendors', to: '/wedding-vendor-dashboard' }]" />
    </template>

    <template #title-outer:prepend>
      <v-button class="header-icon" rounded icon secondary disabled>
        <v-icon name="celebration" />
      </v-button>
    </template>

    <template #navigation>
      <workspace-sidebar-detail />
      <component
        :is="`module-bar-${moduleBarPosition}`"
        :modules="modulesWithDashboard"
        :current-module="currentModule"
      />
    </template>

    <template #actions>
      <v-button
        v-if="hasPermission('vendors', 'create')"
        rounded
        icon
        :to="addNewVendorUrl"
      >
        <v-icon name="add" />
      </v-button>
    </template>

    <div class="dashboard">
      <v-row>
        <v-col cols="12" md="8">
          <v-card class="stats-card">
            <v-card-title>Vendor Statistics</v-card-title>
            <v-card-text>
              <div class="stats-grid">
                <div class="stat-item">
                  <div class="stat-value">{{ vendorCount }}</div>
                  <div class="stat-label">Total Vendors</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value">{{ featuredVendors }}</div>
                  <div class="stat-label">Featured Vendors</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value">{{ pendingReviews }}</div>
                  <div class="stat-label">Pending Reviews</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value">{{ pendingBookings }}</div>
                  <div class="stat-label">Pending Bookings</div>
                </div>
              </div>
            </v-card-text>
          </v-card>

          <v-card class="recent-activity">
            <v-card-title>Recent Activity</v-card-title>
            <v-card-text>
              <v-list>
                <v-list-item
                  v-for="activity in recentActivity"
                  :key="activity.id"
                >
                  <v-list-item-content>
                    <v-list-item-title>{{ activity.title }}</v-list-item-title>
                    <v-list-item-subtitle>{{ activity.description }}</v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-list-item-subtitle>{{ activity.date }}</v-list-item-subtitle>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card class="quick-actions">
            <v-card-title>Quick Actions</v-card-title>
            <v-card-text>
              <v-list>
                <v-list-item link :to="vendorsCollectionUrl">
                  <v-list-item-icon>
                    <v-icon name="store" />
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>Manage Vendors</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item link :to="bookingsCollectionUrl">
                  <v-list-item-icon>
                    <v-icon name="event" />
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>View Bookings</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item link :to="reviewsCollectionUrl">
                  <v-list-item-icon>
                    <v-icon name="star" />
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>Manage Reviews</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>

                <v-list-item link :to="categoriesCollectionUrl">
                  <v-list-item-icon>
                    <v-icon name="category" />
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>Vendor Categories</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>

          <v-card class="top-vendors">
            <v-card-title>Top Rated Vendors</v-card-title>
            <v-card-text>
              <v-list>
                <v-list-item
                  v-for="vendor in topVendors"
                  :key="vendor.id"
                >
                  <v-list-item-avatar>
                    <img v-if="vendor.profile_image" :src="vendor.profile_image" :alt="vendor.name">
                    <v-icon v-else name="store" />
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>{{ vendor.name }}</v-list-item-title>
                    <v-list-item-subtitle>
                      <v-rating
                        v-model="vendor.rating"
                        readonly
                        dense
                        size="small"
                      />
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-list-item-subtitle>{{ vendor.review_count }} reviews</v-list-item-subtitle>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </private-view>
</template>

<script>
import { useCollectionsStore } from '@/stores/collections';
import { usePermissionsStore } from '@/stores/permissions';
import { useUserStore } from '@/stores/user';
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const collectionsStore = useCollectionsStore();
    const permissionsStore = usePermissionsStore();
    const userStore = useUserStore();
    const router = useRouter();

    // Mock data - in a real implementation, this would come from the API
    const vendorCount = ref(42);
    const featuredVendors = ref(8);
    const pendingReviews = ref(3);
    const pendingBookings = ref(5);

    const recentActivity = ref([
      {
        id: 1,
        title: 'New Vendor Added',
        description: 'Goa Palace Venues was added to the directory',
        date: '2 hours ago'
      },
      {
        id: 2,
        title: 'Review Approved',
        description: 'Review for Coastal Photography was approved',
        date: '5 hours ago'
      },
      {
        id: 3,
        title: 'Booking Confirmed',
        description: 'Wedding planning booking confirmed for Paradise Resort',
        date: '1 day ago'
      }
    ]);

    const topVendors = ref([
      {
        id: 1,
        name: 'Coastal Photography',
        rating: 4.8,
        review_count: 24,
        profile_image: null
      },
      {
        id: 2,
        name: 'Goa Palace Venues',
        rating: 4.7,
        review_count: 18,
        profile_image: null
      },
      {
        id: 3,
        name: 'Tropical Catering',
        rating: 4.6,
        review_count: 21,
        profile_image: null
      }
    ]);

    const hasPermission = (collection, action) => {
      return permissionsStore.hasPermission(collection, action);
    };

    const addNewVendorUrl = computed(() => {
      return `/collections/vendors/+`;
    });

    const vendorsCollectionUrl = computed(() => {
      return `/collections/vendors`;
    });

    const bookingsCollectionUrl = computed(() => {
      return `/collections/vendor_bookings`;
    });

    const reviewsCollectionUrl = computed(() => {
      return `/collections/vendor_reviews`;
    });

    const categoriesCollectionUrl = computed(() => {
      return `/collections/vendor_categories`;
    });

    return {
      vendorCount,
      featuredVendors,
      pendingReviews,
      pendingBookings,
      recentActivity,
      topVendors,
      hasPermission,
      addNewVendorUrl,
      vendorsCollectionUrl,
      bookingsCollectionUrl,
      reviewsCollectionUrl,
      categoriesCollectionUrl
    };
  }
};
</script>

<style scoped>
.dashboard {
  padding: var(--content-padding);
  padding-top: 0;
}

.stats-card,
.recent-activity,
.quick-actions,
.top-vendors {
  margin-bottom: 20px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  margin-top: 10px;
}

.stat-item {
  text-align: center;
  padding: 15px;
  border-radius: 8px;
  background-color: var(--background-normal);
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: var(--primary);
}

.stat-label {
  font-size: 0.9rem;
  color: var(--foreground-subdued);
  margin-top: 5px;
}

.header-icon {
  --v-button-background-color: var(--primary-10);
  --v-button-color: var(--primary);
  --v-button-background-color-hover: var(--primary-25);
  --v-button-color-hover: var(--primary);
}

.v-card-title {
  font-size: 1.2rem;
  font-weight: 600;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-normal);
  margin-bottom: 16px;
}
</style>