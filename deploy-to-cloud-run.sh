#!/bin/bash

# L&G ESG Demo - Google Cloud Run Deployment Script
# Uses Cloud Run source-based deployment (no Docker required)

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ID="${GOOGLE_CLOUD_PROJECT_ID:-l-g-esgdemo2}"
SERVICE_NAME="${SERVICE_NAME:-l-g-esgdemo2}"
REGION="${GOOGLE_CLOUD_REGION:-us-central1}"
MEMORY="${MEMORY:-2Gi}"
CPU="${CPU:-2}"
MAX_INSTANCES="${MAX_INSTANCES:-10}"
PORT="3000"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if gcloud is installed
check_gcloud() {
    if ! command -v gcloud &> /dev/null; then
        print_error "gcloud CLI is not installed. Please install it first:"
        echo "  curl https://sdk.cloud.google.com | bash"
        echo "  exec -l \$SHELL"
        echo "  gcloud init"
        exit 1
    fi
    print_success "gcloud CLI is installed"
}

# Function to get or set project ID
setup_project() {
    if [ -z "$PROJECT_ID" ] || [ "$PROJECT_ID" = "l-g-esgdemo2" ]; then
        # Try to get current project
        CURRENT_PROJECT=$(gcloud config get-value project 2>/dev/null || echo "")
        
        if [ -n "$CURRENT_PROJECT" ] && [ "$CURRENT_PROJECT" != "l-g-esgdemo2" ]; then
            print_status "Current project: $CURRENT_PROJECT"
            read -p "Use current project '$CURRENT_PROJECT' instead of 'l-g-esgdemo2'? (y/n): " -n 1 -r
            echo
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                PROJECT_ID=$CURRENT_PROJECT
            fi
        fi
        
        # If still using default, confirm it exists
        if [ "$PROJECT_ID" = "l-g-esgdemo2" ]; then
            print_status "Using default project: l-g-esgdemo2"
            read -p "Continue with project 'l-g-esgdemo2'? (y/n): " -n 1 -r
            echo
            if [[ ! $REPLY =~ ^[Yy]$ ]]; then
                echo
                print_status "Available projects:"
                gcloud projects list --format="table(projectId,name,projectNumber)"
                echo
                read -p "Enter your Google Cloud Project ID: " PROJECT_ID
            fi
        fi
    fi
    
    # Set the project
    print_status "Setting project to: $PROJECT_ID"
    gcloud config set project $PROJECT_ID
    
    if [ $? -ne 0 ]; then
        print_error "Failed to set project. Please check your project ID."
        exit 1
    fi
    
    print_success "Project set to: $PROJECT_ID"
}

# Function to enable required APIs
enable_apis() {
    print_status "Enabling required Google Cloud APIs..."
    
    apis=(
        "cloudbuild.googleapis.com"
        "run.googleapis.com"
        "containerregistry.googleapis.com"
    )
    
    for api in "${apis[@]}"; do
        print_status "Enabling $api..."
        gcloud services enable $api
        if [ $? -eq 0 ]; then
            print_success "Enabled $api"
        else
            print_error "Failed to enable $api"
            exit 1
        fi
    done
}

# Function to check if billing is enabled
check_billing() {
    print_status "Checking if billing is enabled..."
    
    BILLING_ENABLED=$(gcloud beta billing projects describe $PROJECT_ID --format="value(billingEnabled)" 2>/dev/null || echo "false")
    
    if [ "$BILLING_ENABLED" != "True" ]; then
        print_warning "Billing is not enabled for this project."
        print_warning "Please enable billing in the Google Cloud Console:"
        print_warning "https://console.cloud.google.com/billing/linkedaccount?project=$PROJECT_ID"
        read -p "Press Enter after enabling billing to continue..."
    else
        print_success "Billing is enabled"
    fi
}

# Function to create a Dockerfile for the omnis-ui directory
create_dockerfile() {
    print_status "Creating Dockerfile for omnis-ui..."
    
    cat > omnis-ui/Dockerfile << 'EOF'
# Use Node.js 18 Alpine
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies for node-gyp and other native modules
RUN apk add --no-cache libc6-compat

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm install

# Copy the application source
COPY . .

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Build the application
RUN npm run build

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Change ownership of the app directory
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
EOF

    print_success "Dockerfile created in omnis-ui directory"
}

# Function to build and deploy
deploy_to_cloud_run() {
    print_status "Starting deployment to Cloud Run..."
    
    # Navigate to the app directory
    if [ ! -d "omnis-ui" ]; then
        print_error "omnis-ui directory not found. Please run this script from the project root."
        exit 1
    fi
    
    # Create Dockerfile if it doesn't exist
    if [ ! -f "omnis-ui/Dockerfile" ]; then
        create_dockerfile
    fi
    
    cd omnis-ui
    
    print_status "Building and deploying to Cloud Run..."
    print_status "Service: $SERVICE_NAME"
    print_status "Region: $REGION"
    print_status "Memory: $MEMORY"
    print_status "CPU: $CPU"
    print_status "Max Instances: $MAX_INSTANCES"
    
    # Deploy using gcloud run deploy with source
    gcloud run deploy $SERVICE_NAME \
        --source . \
        --platform managed \
        --region $REGION \
        --allow-unauthenticated \
        --port $PORT \
        --memory $MEMORY \
        --cpu $CPU \
        --max-instances $MAX_INSTANCES \
        --set-env-vars NODE_ENV=production,NEXT_TELEMETRY_DISABLED=1
    
    if [ $? -eq 0 ]; then
        print_success "Deployment successful!"
        
        # Get the service URL
        SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region $REGION --format="value(status.url)")
        print_success "Your L&G ESG Demo is now live at:"
        echo -e "${GREEN}$SERVICE_URL${NC}"
        
        echo
        echo "💡 Demo credentials:"
        echo "   Email: pedro.clem@kyndryl.com"
        echo "   Password: pedro.clem"
        echo
        echo "📊 Try asking about 'ESG portfolio performance' to see the analytics!"
        
    else
        print_error "Deployment failed!"
        exit 1
    fi
    
    cd ..
}

# Function to show deployment info
show_deployment_info() {
    print_status "Getting deployment information..."
    echo
    echo "=== Deployment Information ==="
    gcloud run services describe $SERVICE_NAME --region $REGION --format="table(
        metadata.name,
        status.url,
        status.conditions[0].status,
        spec.template.spec.containers[0].image
    )"
    echo
    echo "🔧 Management commands:"
    echo "   View logs: gcloud run services logs read $SERVICE_NAME --region=$REGION"
    echo "   Update: Re-run this script"
    echo "   Delete: gcloud run services delete $SERVICE_NAME --region=$REGION"
}

# Main deployment function
main() {
    echo "================================================================"
    echo "       L&G ESG Demo - Google Cloud Run Deployment"
    echo "================================================================"
    echo
    
    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            --project)
                PROJECT_ID="$2"
                shift 2
                ;;
            --region)
                REGION="$2"
                shift 2
                ;;
            --service-name)
                SERVICE_NAME="$2"
                shift 2
                ;;
            --memory)
                MEMORY="$2"
                shift 2
                ;;
            --cpu)
                CPU="$2"
                shift 2
                ;;
            --help)
                echo "Usage: $0 [options]"
                echo ""
                echo "Options:"
                echo "  --project PROJECT_ID      Google Cloud Project ID (default: l-g-esgdemo2)"
                echo "  --region REGION           Deployment region (default: us-central1)"
                echo "  --service-name NAME       Cloud Run service name (default: l-g-esgdemo2)"
                echo "  --memory MEMORY           Memory allocation (default: 2Gi)"
                echo "  --cpu CPU                 CPU allocation (default: 2)"
                echo "  --help                    Show this help message"
                echo ""
                echo "This version uses Cloud Run source deployment (no local Docker required)"
                echo ""
                exit 0
                ;;
            *)
                print_error "Unknown option: $1. Use --help for usage information."
                exit 1
                ;;
        esac
    done
    
    # Pre-flight checks
    print_status "Starting deployment process..."
    check_gcloud
    setup_project
    check_billing
    enable_apis
    
    echo
    print_status "Pre-flight checks completed successfully!"
    echo
    
    # Confirm deployment
    echo "Deployment Configuration:"
    echo "• Project: $PROJECT_ID"
    echo "• Service: $SERVICE_NAME"
    echo "• Region: $REGION"
    echo "• Memory: $MEMORY"
    echo "• CPU: $CPU"
    echo "• Max Instances: $MAX_INSTANCES"
    echo "• Method: Cloud Run source deployment"
    echo
    
    read -p "Proceed with deployment? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_warning "Deployment cancelled by user"
        exit 0
    fi
    
    # Deploy
    deploy_to_cloud_run
    
    # Post-deployment
    show_deployment_info
    
    echo
    print_success "🎉 L&G ESG Demo deployment completed successfully!"
    print_status "Next steps:"
    echo "1. Test your application thoroughly"
    echo "2. Set up custom domain (optional)"
    echo "3. Monitor costs and performance"
    echo
}

# Handle script interruption
trap 'print_error "Deployment interrupted"' INT TERM

# Run main function
main "$@"
